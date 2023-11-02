import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {validate as isUUID} from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedPost } from './entities/saved-post.entity';
import { Followers } from './entities/followers.entity';
import { Follows } from './entities/follows.entity';
import { SavePostDto } from './dto/save-post.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

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
    private readonly FollowsRepository: Repository<Follows>,

    private readonly jwtService: JwtService,

  ) {}

  async create(createUserDto: CreateUserDto) {
    try{
      const { password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10)
      })

      // Guardar el nuevo usuario en la base de datos.
      await this.userRepository.save( user )
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken( {nickname: user.nickname} )
      };

    }catch (error){
      this.hadleDBExceptions(error);
    }
  }

  async login( loginUserDto: LoginUserDto){
    const { password, nickname } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {nickname},
      select: {nickname: true, password: true}
    })

    if( !user )
      throw new UnauthorizedException('Credentials are not valid (nickname)');

    if ( !bcrypt.compareSync( password, user.password ) )
    throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken( {nickname: user.nickname} )
    };
    //retornar jwt
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Busca al usuario correspondiente por su ID
    const user = await this.userRepository.findOneBy({id: id});

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Actualiza los campos del usuario con los valores de updateUserDto
    Object.assign(user, updateUserDto);

    // Guarda la actualización en la base de datos
    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

 async remove(id: string) {
    let user: User;

    if (isUUID(id) ){
      user = await this.userRepository.findOneBy({ id: id });
    }

    if ( !user )
    throw new NotFoundException(`User with id ${ id } not found`);

    return this.userRepository.delete(id);
  }

  private hadleDBExceptions( error: any ): never{
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  async savePostToUser(id: string, postData: SavePostDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.saved_post', 'savedPost')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const savedPost = new SavedPost();
    savedPost.authorId = postData.authorId;
    savedPost.idPost = postData.idPost;

    user.saved_post.push(savedPost);
    await this.userRepository.save(user);

    return user;
  }

  private getJwtToken( payload: JwtPayload) {
    
    const token = this.jwtService.sign( payload );
    return token;

  }

 }

