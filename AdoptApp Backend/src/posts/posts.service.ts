import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAdoptDto } from './dto/adopt-post.dto';
import { CreateLostDto } from './dto/lost-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adopt } from './entities/typepost-entitys/adopt-post.entity';
import { Lost } from './entities/typepost-entitys/lost-post.entity';
import { Form } from './entities/form.entity';
import { PostLikes } from './entities/post-like.entity';
import { Informative } from './entities/typepost-entitys/informative-post.entity';
import { createInformativeDto } from './dto/informative-post.dto';
import { PostMultimedia } from './entities/multimedia-post.entity';

type PostType = Adopt | Lost | Informative;

@Injectable()
export class PostsService {
  
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Adopt)
    private readonly adoptRepository: Repository<Adopt>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lost)
    private readonly lostRepository: Repository<Lost>,
    @InjectRepository(Informative)
    private readonly informativeRepository: Repository<Informative>,
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(PostLikes)
    private postLikesRepository: Repository<PostLikes>,
    @InjectRepository(PostMultimedia)
    private postMultimediaRepository: Repository<PostMultimedia>
  ) {}

  async createAdoptPost(id: string, createAdoptDto: CreateAdoptDto, mediaUrls: string[]): Promise<Adopt> {
    // Busca al usuario correspondiente por su ID
    const user = await this.userRepository.findOneBy({id: id});

    if ( !user )
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    // Crea un nuevo post de tipo Adopt y asigna las propiedades
    const adopt = new Adopt();
    adopt.title = createAdoptDto.title;
    adopt.description = createAdoptDto.description;
    adopt.author = user;
    adopt.authorID = user.id;
    adopt.type = createAdoptDto.type;
    adopt.state = createAdoptDto.state;
    adopt.gender = createAdoptDto.gender;
    adopt.age = createAdoptDto.age ;
    adopt.personality = createAdoptDto.personality;
    adopt.medical_information = createAdoptDto.medical_information;
    adopt.form = [];

    // Se guarda el nuevo post en la base de datos
    const createdAdopt = await this.adoptRepository.save(adopt);

    for (const url of mediaUrls) {
      const multimedia = this.postMultimediaRepository.create({ url, adoptPost: createdAdopt });
      await this.postMultimediaRepository.save(multimedia);
    }

    return createdAdopt;
  }

  async createLostPost(id: string, createLostDto: CreateLostDto, mediaUrls: string[]): Promise<Lost> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const lost = new Lost();
    lost.title = createLostDto.title;
    lost.description = createLostDto.description;
    lost.author = user;
    lost.authorID = user.id;
    lost.type = createLostDto.type;
    lost.state = createLostDto.state;
    lost.track_detail = createLostDto.track_detail;
    lost.relevant_information = createLostDto.relevant_information;
    lost.latitude = createLostDto.latitude;
    lost.longitude = createLostDto.longitude
    lost.last_change = new Date();
    lost.coordinates = createLostDto.coordinates;

    const createdLost = await this.lostRepository.save(lost);

    for (const url of mediaUrls) {
      const multimedia = this.postMultimediaRepository.create({ url, lostPost: createdLost });
      await this.postMultimediaRepository.save(multimedia);
    }

    return createdLost;
  }

  async createInformativePost(dto: createInformativeDto, userId: string, mediaUrls: string[]): Promise<Informative> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const newPost = this.informativeRepository.create({
      ...dto,
      author: user,
      authorID: user.id
    });

    const savedPost = await this.informativeRepository.save(newPost);

    // Guardar cada entidad multimedia en la base de datos
    for (const url of mediaUrls) {
      const multimedia = this.postMultimediaRepository.create({ url, informativePost: savedPost });
      await this.postMultimediaRepository.save(multimedia);
    }

    return savedPost;
  }

  async getPostsByType(type: string) {
    let posts;
    switch (type) {
      case 'adopt':
        posts = await this.adoptRepository.find({
          relations: ['multimedia'],
        });
        break;
      case 'informative':
        posts = await this.informativeRepository.find({
          relations: ['multimedia'],
        });
        break;
      case 'lost':
        posts = await this.lostRepository.find({
          relations: ['multimedia'],
        });
        break;
      default:
        throw new NotFoundException(`Type ${type} not found`);
    }
  
    return posts.map(post => ({
      ...post,
      multimedia: undefined,
      images: post.multimedia.map(multimedia => multimedia.url) 
    }));
  }

  async getPostById(id: string): Promise<PostType> {
    let post: PostType;

    post = await this.adoptRepository.findOneBy({ id });
    if (post) return post;

    post = await this.lostRepository.findOneBy({ id });
    if (post) return post;

    post = await this.informativeRepository.findOneBy({ id });
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);

    return post;
  }

  async getUserPostsJson(userId: string): Promise<any[]> {
    const allUserPosts = [
      ...await this.adoptRepository.find({ where: { authorID: userId }, relations: ['multimedia'] }),
      ...await this.lostRepository.find({ where: { authorID: userId }, relations: ['multimedia'] }),
      ...await this.informativeRepository.find({ where: { authorID: userId }, relations: ['multimedia'] }),
    ];

    if (allUserPosts.length === 0) {
      throw new NotFoundException(`No se encontraron publicaciones para el usuario con ID ${userId}`);
    }
  
    // Se transforma los objetos en un formato JSON entendible en el front
    const userPostsJson = allUserPosts.map(post => {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        likesCount: post.likesCount,
        firstImageUrl: post.multimedia.length > 0 ? post.multimedia[0].url : null,
        type: post.type
        // Quedan pendientes segun peticion por definir
      };
  });
  
    return userPostsJson;
  }

  async updatePost(id: string, updatePostDto: any): Promise<Post> {
    let post: Adopt | Lost | Informative;

    // se busca el posteo en todas las bases de datos
    post = await this.adoptRepository.findOneBy({ id });
    if (!post) post = await this.lostRepository.findOneBy({ id });
    if (!post) post = await this.informativeRepository.findOneBy({ id });

    if (!post) throw new NotFoundException(`Publicación con ID ${id} no encontrada`);

    // Se actualizan los campos específicos
    if (post instanceof Adopt) {
      post.title = updatePostDto.title ?? post.title;
      post.description = updatePostDto.description ?? post.description;  
      post.state = updatePostDto.state ?? post.state;
      post.gender = updatePostDto.gender ?? post.gender;
      post.age = updatePostDto.age ?? post.age;
      post.personality = updatePostDto.personality ?? post.personality;
      post.medical_information = updatePostDto.medical_information ?? post.medical_information;
    } else if (post instanceof Lost) {
      post.track_detail = updatePostDto.track_detail ?? post.track_detail;
      post.state = updatePostDto.state ?? post.state;
      post.coordinates = updatePostDto.coordinates ?? post.coordinates;
    } else if (post instanceof Informative) {
      post.title = updatePostDto.title ?? post.title;
      post.description = updatePostDto.description ?? post.description;
    }

    // Se guarda el posteo actualizado
    if (post instanceof Adopt) {
        return await this.adoptRepository.save(post);
    } else if (post instanceof Lost) {
        return await this.lostRepository.save(post);
    } else if (post instanceof Informative) {
        return await this.informativeRepository.save(post);
    }
  }

  async deletePost(id: string): Promise<void> {
    let result = await this.adoptRepository.delete({ id });
    if (result.affected === 0) {
        result = await this.lostRepository.delete({ id });
    }
    if (result.affected === 0) {
        result = await this.informativeRepository.delete({ id });
    }

    if (result.affected === 0) {
        throw new NotFoundException(`Post with id ${id} not found`);
  }
}

  ////////////////////////
  // Seccion Formulario //
  ////////////////////////

  //se crea el formulario de adopcion con los parametros rellenados por le usuario
  async createFormAdoption(idPost: string, idApplicant: string,formData: Partial<Form>): Promise<Form> {
    const adopt = await this.adoptRepository.findOneBy(({ id: idPost }));

    if (!adopt) {
      throw new NotFoundException(`Publicación con ID ${idPost} no encontrada`);
    }

    const form = this.formRepository.create({
      ...formData,
      idApplicant: idApplicant,
      post: adopt,
    });

    return this.formRepository.save(form);
  }

  //se obtienen los formularios creados enviados a la publicacion
  async getFormsByPostId(idPost: string): Promise<Form[]> {

    const forms = await this.formRepository.find({
        where: { post: { id: idPost } },
        relations: ['post'],
    });

    if (!forms) {
        throw new NotFoundException(`No existe un formulario con el id: ${idPost}`);
    }

    return forms;
    }

  //se obtienen los post donde se envio formulario por id del usuario
  async getPostsAppliedByUserId(idUser: string): Promise<Form[]> {
    const forms = await this.formRepository.find({
        where: { idApplicant: idUser },
        relations: ['post'],
    });
    if (!forms) {
        throw new NotFoundException(`No posts found applied by user with id ${idUser}`);
    }
    return forms;
  }

  //funcion de errores
  private hadleDBExceptions( error: any ){
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  ///////////////////////
  // Seccion LikePost //
  ///////////////////////

  async unlikePost(postId: string, userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const post = await this.findPost(postId);
    if (!post) {
        throw new Error('Publicacion no encontrada');
    }

    let existingLike;

    if (post instanceof Adopt) {
        existingLike = await this.postLikesRepository.findOne({ where: { adoptPost: { id: postId }, user: { id: userId } } });
    } else if (post instanceof Lost) {
        existingLike = await this.postLikesRepository.findOne({ where: { lostPost: { id: postId }, user: { id: userId } } });
    } else if (post instanceof Informative) {
        existingLike = await this.postLikesRepository.findOne({ where: { informativePost: { id: postId }, user: { id: userId } } });
    }

    if (existingLike) {
        await this.postLikesRepository.remove(existingLike);

        // se quita un like
        post.likesCount--;
        // se guardar el post en su repositorio correspondiente
        if (post instanceof Adopt) {
            await this.adoptRepository.save(post);
        } else if (post instanceof Lost) {
            await this.lostRepository.save(post);
        } else if (post instanceof Informative) {
            await this.informativeRepository.save(post);
        }
    }
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const post = await this.findPost(postId);
    if (!post) {
      throw new NotFoundException(`Publicación con ID ${postId} no encontrada`);
    }

    let existingLike;
    // se busca el tipo especifico del post y verifica si ya existe un "like"
    if (post instanceof Adopt) {
        existingLike = await this.postLikesRepository.findOne({ where: { adoptPost: { id: postId }, user: { id: userId } } });
    } else if (post instanceof Lost) {
        existingLike = await this.postLikesRepository.findOne({ where: { lostPost: { id: postId }, user: { id: userId } } });
    } else if (post instanceof Informative) {
        existingLike = await this.postLikesRepository.findOne({ where: { informativePost: { id: postId }, user: { id: userId } } });
    }
    if (existingLike) {
      throw new Error('Liked yet');
    }

    if (!existingLike) {
      const postLike = new PostLikes();
      // Se guarda el posteo segun su tipo en la bdd
      if (post instanceof Adopt) {
          postLike.adoptPost = post;
      } else if (post instanceof Lost) {
          postLike.lostPost = post;
      } else if (post instanceof Informative) {
          postLike.informativePost = post;
      }
      postLike.user = user;
      await this.postLikesRepository.save(postLike);

      // Se incrementa el contador de likes en el post encontrado
      post.likesCount++;
      // Se guarda el post en su repositorio correspondiente
      if (post instanceof Adopt) {
          await this.adoptRepository.save(post);
      } else if (post instanceof Lost) {
          await this.lostRepository.save(post);
      } else if (post instanceof Informative) {
          await this.informativeRepository.save(post);
      }
    }
  }

  private async findPost(postId: string): Promise<Post | Informative | Adopt | Lost | undefined> {
    return await this.informativeRepository.findOne({ where: { id: postId } }) || 
           await this.adoptRepository.findOne({ where: { id: postId } }) ||
           await this.lostRepository.findOne({ where: { id: postId } });
  }

  ////////////////////////
  // Seccion Imagenes   //
  ////////////////////////

  async updatePostImages(id: string, newMediaUrls: string[]): Promise<void> {
    const post = await this.findPost(id);
    if (!post) throw new NotFoundException(`Publicación con ID ${id} no encontrada`);

    // Se busca el tipo del posteo y una vez enocontrado se eliminan las imagenes
    if (post instanceof Adopt) {
      await this.postMultimediaRepository.delete({ adoptPost: { id } });
    } else if (post instanceof Lost) {
      await this.postMultimediaRepository.delete({ lostPost: { id } });
    } else if (post instanceof Informative) {
      await this.postMultimediaRepository.delete({ informativePost: { id } });
    }

    // Se cambian a las nuevas imagenes ingresadas
    for (const url of newMediaUrls) {
      const multimedia = new PostMultimedia();
      multimedia.url = url;
      if (post instanceof Adopt) {
        multimedia.adoptPost = post;
      } else if (post instanceof Lost) {
        multimedia.lostPost = post;
      } else if (post instanceof Informative) {
        multimedia.informativePost = post;
      }
      await this.postMultimediaRepository.save(multimedia);
    }
  }
}
