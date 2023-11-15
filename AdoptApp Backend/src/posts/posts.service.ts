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
    throw new NotFoundException(`Product with id ${ id } not found`);

    //const ageNumber = parseInt(createAdoptDto.age, 10);
    //if (isNaN(ageNumber) || ageNumber <= 0) {
    //    throw new BadRequestException('Invalid age value');
    //}

    // Crea un nuevo post de tipo Adopt y asigna las propiedades
    const adopt = new Adopt();
    adopt.title = createAdoptDto.title;
    adopt.description = createAdoptDto.description;
    adopt.author = user;
    adopt.authorID = user.id; // Asigna la ID del usuario como autor
    adopt.type = createAdoptDto.type;
    adopt.state = createAdoptDto.state;
    adopt.gender = createAdoptDto.gender;
    adopt.age = createAdoptDto.age ;
    adopt.personality = createAdoptDto.personality;
    adopt.medical_information = createAdoptDto.medical_information;
    adopt.form = [];

    // Guarda el nuevo post en la base de datos
    const createdAdopt = await this.adoptRepository.save(adopt);

    for (const url of mediaUrls) {
      const multimedia = this.postMultimediaRepository.create({ url, adoptPost: createdAdopt });
      await this.postMultimediaRepository.save(multimedia);
    }

    return createdAdopt;
  }

  async createLostPost(id: string, createLostDto: CreateLostDto): Promise<Lost> {
    // Busca al usuario correspondiente por su ID
    const user = await this.userRepository.findOneBy({ id: id });
  
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  
    // Crea un nuevo post de tipo "Lost" y asigna las propiedades
    const lost = new Lost();
    lost.title = createLostDto.title;
    lost.description = createLostDto.description;
    lost.author = user;
    lost.authorID = user.id; // 
    lost.type = createLostDto.type;
    lost.state = createLostDto.state;
    lost.track_detail = createLostDto.track_detail;
  
    // Establece la fecha y hora inicial en last_change
    lost.last_change = new Date();
  
    lost.coordinates = createLostDto.coordinates;
  
    // Guarda el nuevo post en la base de datos
    const createdLost = await this.lostRepository.save(lost);

    return createdLost;
  }

  async createInformativePost(dto: createInformativeDto, userId: string, mediaUrls: string[]): Promise<Informative> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
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

  async getUserPosts(id: string): Promise<Adopt[]> {
    // Lógica para obtener todos los posteos del usuario, sin importar el tipo
    const posts = await this.adoptRepository.find({
      where: { authorID: id },
    });
    return posts;
  }

  async createFormAdoption(idPost: string, idApplicant: string,formData: Partial<Form>): Promise<Form> {
    const adopt = await this.adoptRepository.findOneBy(({ id: idPost }));

    const form = this.formRepository.create({
      ...formData,
      idApplicant: idApplicant,
      author: adopt,
    });

    return this.formRepository.save(form);
  }

  async getUserPostsJson(userId: string): Promise<any[]> {
    const allUserPosts = [
      ...await this.adoptRepository.find({ where: { authorID: userId }, relations: ['multimedia'] }),
      ...await this.lostRepository.find({ where: { authorID: userId }, relations: ['multimedia'] }),
      ...await this.informativeRepository.find({ where: { authorID: userId }, relations: ['multimedia'] }),
    ];
  
    // Transforma los objetos en un formato JSON adecuado para el frontend
    const userPostsJson = allUserPosts.map(post => {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        likesCount: post.likesCount,
        firstImageUrl: post.multimedia.length > 0 ? post.multimedia[0].url : null,
        // Agrega aquí más campos si es necesario
      };
    });
  
    return userPostsJson;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    // Busca la publicación con el ID proporcionado
    const post = await this.postRepository.findOneBy({id: id});
  
    // Verifica si la publicación existe
    if (!post) {
      throw new NotFoundException(`Publicación con ID ${id} no encontrada`);
    }
  
    // Actualiza las propiedades de la publicación con los valores proporcionados en updatePostDto
    Object.assign(post, updatePostDto);
  
    // Guarda la publicación actualizada en la base de datos
    const updatedPost = await this.postRepository.save(post);
  
    return updatedPost;
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
        throw new Error('User not found');
    }

    const post = await this.findPost(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    let existingLike;
    // Determina el tipo específico de post y verifica si ya existe un "like"
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
        throw new Error('User not found');
    }

    const post = await this.findPost(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    let existingLike;
    // Determina el tipo específico de post y verifica si ya existe un "like"
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

        // Se Incrementa el contador de likes en el post específico
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
  
}
