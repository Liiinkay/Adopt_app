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
import * as nodemailer from 'nodemailer';

import { Informative } from '../posts/entities/typepost-entitys/informative-post.entity';
import { Lost } from 'src/posts/entities/typepost-entitys/lost-post.entity';
import { Adopt } from 'src/posts/entities/typepost-entitys/adopt-post.entity';


@Injectable()
export class UsersService {

  private createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,    
        pass: process.env.EMAIL_PASS
      },
    });
  }

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

  async create(createUserDto: CreateUserDto, profileImagePath?: string, bannerImagePath?: string) {
    try {
      const { password, ...userData } = createUserDto;
  
      // Se establecen imágenes predeterminadas si no se proporcionan
      const defaultProfileImg = 'img/profile/profile_default.jpg';
      const defaultBannerImg = 'img/banner/banner_default.jpg';
  
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        profile_img: profileImagePath || defaultProfileImg,
        banner_multimedia: bannerImagePath || defaultBannerImg,
      });
  
      await this.userRepository.save(user);
      delete user.password;
  
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
        message: 'Usuario creado con éxito'
      };
  
    } catch (error) {
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
      throw new UnauthorizedException('Credenciales no válidas (nickname)');

    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    //Return del token
    return {
      ...user,
      token: this.getJwtToken( {id: user.id} ),
      message: 'Inicio de sesión exitoso'
    };
  }

  logout(userId: string): { message: string } {
    console.log(`User with ID ${userId} logged out`);
    return { message: 'Cierre de sesión exitoso' };
  }

  findAll() {
    const users = this.userRepository.find();
    if ( !users ) {
      throw new NotFoundException('No se encontraron usuarios');
    }
    return users;
  }

  async findAllUsers() {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'last_name']
    });

    if (!users.length) {
      throw new NotFoundException('No se encontraron usuarios');
    }

    return users.map(user => ({
      id: user.id,
      fullName: `${user.name} ${user.last_name}`
    }));
  }

  async findByNickname(nickname: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        nickname: nickname.toLowerCase().trim(),
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con nickname '${nickname}' no encontrado`);
    }

    return user;
  }

  async findOne(id: string) {
    let user: User;

    if (isUUID(id) ){
      user = await this.userRepository.findOneBy({ id: id });
    }

    if ( !user )
      throw new NotFoundException(`Usuario con el id ${id} no encontrado`);

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

    return { message: 'Contraseña cambiada con éxito' };
  }

  // Método de restablecimiento de contraseña
  async requestPasswordReset(contact_email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { contact_email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Genera contraseña temporal
    const tempPassword = Math.random().toString(36).slice(-8);
    user.password = bcrypt.hashSync(tempPassword, 10);

    await this.userRepository.save(user);

    // Enviar correo electrónico con la contraseña temporal
    await this.sendResetPasswordEmail(contact_email, tempPassword);
    return { message: 'Solicitud de restablecimiento de contraseña enviada con éxito' };
  }

  // Método para enviar correo electrónico con la contraseña temporal
  private async sendResetPasswordEmail(email: string, tempPassword: string): Promise<void> {
    const transporter = this.createTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Recuperación de Contraseña',
      text: `Tu contraseña temporal es: ${tempPassword}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async update(id: string, updateUserDto: UpdateUserDto, profileImagePath: string, bannerImagePath: string): Promise<any> {
    const user = await this.userRepository.findOneBy({id: id});

    if (!user) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Actualiza la imagen de perfil si se ha subido una nueva, si no, queda igual
    user.profile_img = profileImagePath ? profileImagePath : user.profile_img;

    // Actualiza la imagen de banner si se ha subido una nueva, si no, queda igual
    user.banner_multimedia = bannerImagePath ? bannerImagePath : user.banner_multimedia;

    // Actualiza los demás campos del usuario
    Object.assign(user, updateUserDto);

    // Guarda la actualización en la base de datos
    const updatedUser = await this.userRepository.save(user);

    return { ...updatedUser, message: 'Usuario actualizado con éxito' };
}


  async remove(id: string) {
    let user: User;

    if (isUUID(id) ){
      user = await this.userRepository.findOneBy({ id: id });
    }

    if ( !user )
    throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    await this.userRepository.delete(id);
    return { message: 'Usuario eliminado con éxito' };
  }

  async rateUser(userId: string, rating: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Se actualiza la calificacion promedio
    user.rating = ((user.rating * user.ratingCount) + rating) / (user.ratingCount + 1);
    user.ratingCount++;

    await this.userRepository.save(user);

    return { message: 'Usuario calificado con éxito' };
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

  async savePost(userId: string, postId: string): Promise<{ savedPost: SavedPost, message: string }> {

    // Se Verifica si el post ya está guardado
    const existingSavedPost = await this.savedPostRepository.findOne({
      where: { authorId: userId, idPost: postId }
    });

    if (existingSavedPost) {
      throw new BadRequestException('Publicación ya guardada');
    }

    // Se verifica si el post existe en alguna de las tres bases de datos
    const postExists = await this.adoptRepository.findOneBy({ id: postId })
    || await this.informativeRepository.findOneBy({ id: postId })
    || await this.lostRepository.findOneBy({ id: postId });

    if (!postExists) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Crea el nuevo posteo guardado
    const newSavedPost = this.savedPostRepository.create({
      authorId: userId,
      idPost: postId
    });

    return {
      savedPost: newSavedPost,
      message: 'Publicación guardada con éxito'
    };

  }

  async removeSavedPost(userId: string, postId: string): Promise<{ message: string }>{
    const savedPost = await this.savedPostRepository.findOne({
    where: { authorId: userId, idPost: postId }
    });

    if (!savedPost) {
      throw new NotFoundException('Publicación guardada no encontrada');
    }

    await this.savedPostRepository.remove(savedPost);
    return { message: 'Publicación guardada eliminada con éxito' };
  }

  async getSavedPosts(idUser: string): Promise<SavedPost[]> {
    const savedPosts = await this.savedPostRepository.find({
      where: { authorId: idUser }
    });
  
    if (!savedPosts || savedPosts.length === 0) {
      throw new NotFoundException('No se encontraron publicaciones guardadas');
    }
  
    return savedPosts;
  }

  /////////////////////
  // Seccion Follows //
  /////////////////////

  async followUser(followerId: string, followingId: string):  Promise<{ follow: Follows, message: string }> {
    // Se verifica si el seguidor existe
    const follower = await this.userRepository.findOneBy({ id: followerId });
    if (!follower) {
      throw new NotFoundException(`Seguidor con ID ${followerId} no encontrado`);
    }

    // Se verifica si el usuario a seguir existe
    const following = await this.userRepository.findOneBy({ id: followingId });
    if (!following) {
      throw new NotFoundException(`Usuario a seguir con ID ${followingId} no encontrado`);
    }

    // Se verifica si el usuario ya sigue al otro
    const existingFollow = await this.followsRepository.findOne({
      where: { authorId: followerId, followingId: followingId }
    });

    if (existingFollow) {
      throw new BadRequestException('Ya sigues a este usuario');
    }

    // Crea el nuevo seguimiento
    const newFollow = this.followsRepository.create({ authorId: followerId, followingId: followingId });
    
    await this.incrementFollowersCount(followingId);
    await this.incrementFollowingCount(followerId);
    
    return {
      follow: await this.followsRepository.save(newFollow),
      message: 'Usuario seguido con éxito'
    };
  }

  async unfollowUser(followerId: string, followingId: string): Promise<{ message: string }> {

    //Se verifica si realmente sigue a la cuenta
    const follow = await this.followsRepository.findOne({
      where: { authorId: followerId, followingId: followingId }
    });
  
    if (!follow) {
      throw new NotFoundException('Relación de seguimiento no encontrada');
    }
  
    //se actualizan los counts de cada usuario
    await this.decrementFollowersCount(followingId);
    await this.decrementFollowingCount(followerId);

    await this.followsRepository.remove(follow);

    return { message: 'Has dejado de seguir a este usuario con éxito' };
  }

  async getFollowing(followerId: string): Promise<Follows[]> {
    return this.followsRepository.find({
      where: { authorId: followerId },
      relations: ['author'] 
    });
  }

  async getFollowers(userId: string): Promise<any[]> {
    const followers = await this.followsRepository.find({
      where: { followingId: userId },
      relations: ['author'] 
    });
  
    return followers.map(follow => {
      return {
        id: follow.author.id,
        nickname: follow.author.nickname,
        profile_img: follow.author.profile_img
      };
    });
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

