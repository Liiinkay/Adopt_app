import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {validate as isUUID} from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedPost } from './entities/saved-post.entity';
import { Follows } from './entities/follows.entity';
import { SavePostDto } from './dto/save-post.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

import { Informative } from '../posts/entities/typepost-entitys/informative-post.entity';
import { Lost } from 'src/posts/entities/typepost-entitys/lost-post.entity';
import { Adopt } from 'src/posts/entities/typepost-entitys/adopt-post.entity';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('ProductService');

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(SavedPost)
    private readonly savedPostRepository: Repository<SavedPost>,

    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>,

    @InjectRepository(Lost)
    private readonly lostRepository: Repository<Lost>,

    @InjectRepository(Adopt)
    private readonly adoptRepository: Repository<Adopt>,

    @InjectRepository(Informative)
    private readonly informativeRepository: Repository<Informative>,

    private readonly jwtService: JwtService,

  ) {}

  async create(createUserDto: CreateUserDto, profileImagePath: string, bannerImagePath: string) {
    try{
      const { password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        profile_img: profileImagePath,
        banner_multimedia: bannerImagePath
      });

      // Guardar el nuevo usuario en la base de datos.
      await this.userRepository.save( user )
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken( {id: user.id} )
      };

    }catch (error){
      this.hadleDBExceptions(error);
    }
  }

  async login( loginUserDto: LoginUserDto){
    const { password, nickname } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {nickname},
      select: {nickname: true, password: true, id: true}
    })

    if( !user )
      throw new UnauthorizedException('Credentials are not valid (nickname)');

    if ( !bcrypt.compareSync( password, user.password ) )
    throw new UnauthorizedException('Credentials are not valid (password)');

    //Return del token
    return {
      ...user,
      token: this.getJwtToken( {id: user.id} )
    };
  }

  logout(userId: string): void {
    console.log(`User with ID ${userId} logged out`);
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

  async changePassword(contact_email: string, currentPassword: string, newPassword: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { contact_email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async update(id: string, updateUserDto: UpdateUserDto, profileImagePath: string, bannerImagePath: string): Promise<User> {
    // Busca al usuario correspondiente por su ID
    const user = await this.userRepository.findOneBy({id: id});

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (profileImagePath) user.profile_img = profileImagePath;
    if (bannerImagePath) user.banner_multimedia = bannerImagePath;

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

  async rateUser(userId: string, rating: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    // Actualizar la calificación promedio
    user.rating = ((user.rating * user.ratingCount) + rating) / (user.ratingCount + 1);
    user.ratingCount++;

    await this.userRepository.save(user);
  }

  private hadleDBExceptions( error: any ): never{
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  private getJwtToken( payload: JwtPayload) {
    
    const token = this.jwtService.sign( payload );
    return token;

  }

  ///////////////////////
  // Seccion SavedPost //
  ///////////////////////

  async savePost(userId: string, postId: string): Promise<SavedPost> {

    // Se Verifica si el post ya está guardado
    const existingSavedPost = await this.savedPostRepository.findOne({
      where: { authorId: userId, idPost: postId }
    });

    if (existingSavedPost) {
      throw new Error('Post already saved');
    }

    // Se verifica si el post existe en alguna de las tres bases de datos
    const postExists = await this.adoptRepository.findOneBy({ id: postId })
    || await this.informativeRepository.findOneBy({ id: postId })
    || await this.lostRepository.findOneBy({ id: postId });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    // Crea el nuevo posteo guardado
    const newSavedPost = this.savedPostRepository.create({
      authorId: userId,
      idPost: postId
    });

    return this.savedPostRepository.save(newSavedPost);
  }

  async removeSavedPost(userId: string, postId: string): Promise<void> {
    const savedPost = await this.savedPostRepository.findOne({
    where: { authorId: userId, idPost: postId }
    });

    if (!savedPost) {
    throw new NotFoundException('Saved Post not found');
    }

    await this.savedPostRepository.remove(savedPost);
  }

  async getSavedPosts(idUser: string): Promise<SavedPost[]> {
    return this.savedPostRepository.find({
      where: { authorId: idUser }
    });
  }

  /////////////////////
  // Seccion Follows //
  /////////////////////

  async followUser(followerId: string, followingId: string): Promise<Follows> {
    // Se verifica si el seguidor (follower) existe
    const follower = await this.userRepository.findOneBy({ id: followerId });
    if (!follower) {
      throw new NotFoundException(`Follower with ID ${followerId} not found`);
    }

    // Se verifica si el usuario a seguir (following) existe
    const following = await this.userRepository.findOneBy({ id: followingId });
    if (!following) {
      throw new NotFoundException(`Following with ID ${followingId} not found`);
    }

    // Se verifica si el usuario ya sigue al otro
    const existingFollow = await this.followsRepository.findOne({
      where: { authorId: followerId, followingId: followingId }
    });

    if (existingFollow) {
      throw new Error('You already follow this user');
    }

    // Crea el nuevo seguimiento
    const newFollow = this.followsRepository.create({ authorId: followerId, followingId: followingId });
    
    await this.incrementFollowersCount(followingId);
    await this.incrementFollowingCount(followerId);
    
    return this.followsRepository.save(newFollow);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {

    //Se verifica si realmente sigue a la cuenta
    const follow = await this.followsRepository.findOne({
      where: { authorId: followerId, followingId: followingId }
    });
  
    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }
  
    //se actualizan los counts de cada usuario
    await this.decrementFollowersCount(followingId);
    await this.decrementFollowingCount(followerId);

    await this.followsRepository.remove(follow);
  }

  async getFollowing(followerId: string): Promise<Follows[]> {
    return this.followsRepository.find({
      where: { authorId: followerId },
      relations: ['author'] // Asegúrate de cargar la relación con 'author' si es necesario
    });
  }

  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.followsRepository.find({
      where: { followingId: userId },
      relations: ['author']
    });

    return follows.map(follow => follow.author);
  }

  async incrementFollowersCount(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      user.followersCount++;
      await this.userRepository.save(user);
    }
  }

  async decrementFollowersCount(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user && user.followersCount > 0) {
      user.followersCount--;
      await this.userRepository.save(user);
    }
  }

  async incrementFollowingCount(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      user.followingCount++;
      await this.userRepository.save(user);
    } else {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  async decrementFollowingCount(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user && user.followingCount > 0) {
      user.followingCount--;
      await this.userRepository.save(user);
    } else if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}

