import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {validate as isUUID} from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedPost } from './entities/saved-post.entity';
import { Followers } from './entities/followers.entity';
import { Follows } from './entities/follows.entity';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('ProductService');

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(SavedPost)
    private readonly savedPostRepository: Repository<SavedPost>,

    @InjectRepository(Followers)
    private readonly FollowersRepository: Repository<Followers>,

    @InjectRepository(Follows)
    private readonly FollowsRepository: Repository<Follows>

  ) {}

  async create(createUserDto: CreateUserDto) {
    try{
      const newUser = new User();
      newUser.nickname = createUserDto.nickname;
      newUser.name = createUserDto.name;
      newUser.password = createUserDto.password;
      newUser.banner_multimedia = createUserDto.banner_multimedia || '';
      newUser.profile_img = createUserDto.profile_img || '';
      newUser.last_name = createUserDto.last_name || '';
      newUser.rut = createUserDto.rut || '';
      newUser.phone_number = createUserDto.phone_number || 0;
      newUser.contact_email = createUserDto.contact_email || '';
      newUser.instagram = createUserDto.instagram || '';
      newUser.facebook = createUserDto.facebook || '';
  
      // Las propiedades saved_post, posts, followers y follows se inicializan vacías.
      newUser.saved_post = [];
      newUser.post = [];
      newUser.followers = [];
      newUser.follows = [];
  
      // Guardar el nuevo usuario en la base de datos.
      return await this.userRepository.save(newUser);

    }catch (error){
      this.hadleDBExceptions(error);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(term: string) {
    let user: User;

    if (isUUID(term) ){
      user = await this.userRepository.findOneBy({ id: term });
    }

    if ( !user )
    throw new NotFoundException(`Product with id ${ term } not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const product = await this.userRepository.preload({
      id: id,
      ...UpdateUserDto,
      saved_post: []
    })
  }

 async remove(id: string) {
    let user: User;

    if (isUUID(id) ){
      user = await this.userRepository.findOneBy({ id: id });
    }

    if ( !user )
    throw new NotFoundException(`Product with id ${ id } not found`);

    return this.userRepository.delete(id);
  }

  private hadleDBExceptions( error: any ){
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
