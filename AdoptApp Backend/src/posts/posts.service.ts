import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAdoptDto } from './dto/adopt-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adopt } from './entities/adopt-post.entity';

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
  ) {}

  create(createPostDto: CreateAdoptDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async createAdoptPost(id: string, createAdoptDto: CreateAdoptDto): Promise<Adopt> {
    // Busca al usuario correspondiente por su ID
    const user = await this.userRepository.findOneBy({id: id});

    if ( !user )
    throw new NotFoundException(`Product with id ${ id } not found`);

    // Crea un nuevo post de tipo Adopt y asigna las propiedades
    const adopt = new Adopt();
    adopt.title = createAdoptDto.title;
    adopt.description = createAdoptDto.description;
    console.log('1');
    adopt.authorID = id; // Asigna la ID del usuario como autor
    console.log('1');
    adopt.type = createAdoptDto.type;
    adopt.state = createAdoptDto.state;
    adopt.gender = createAdoptDto.gender;
    adopt.age = createAdoptDto.age;
    adopt.personality = createAdoptDto.personality;
    adopt.medical_information = createAdoptDto.medical_information;
    adopt.form = createAdoptDto.form || [];
    adopt.coment = createAdoptDto.coment || [];

    // Guarda el nuevo post en la base de datos
    const createdAdopt = await this.adoptRepository.save(adopt);

    // Agrega el nuevo post a la lista de posts del usuario
    if (!user.post) {
      user.post = [createdAdopt];
    } else {
      user.post.push(createdAdopt);
    }

    // Guarda el usuario con el nuevo post en la base de datos
    await this.userRepository.save(user);

    return createdAdopt;
  }

  async getUserPosts(id: string): Promise<Post[]> {
    // Lógica para obtener todos los posteos del usuario, sin importar el tipo
    const posts = await this.postRepository.find({
      where: { authorID: id },
    });
    return posts;
  }

  //funcion de errores
  private hadleDBExceptions( error: any ){
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }


}
