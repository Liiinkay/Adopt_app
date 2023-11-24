import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SavePostDto } from './dto/save-post.dto';
import { SaveFollowDto } from './dto/save-follow.dto';

import { LoginUserDto } from './dto/login-user.dto';
import { Req, SetMetadata, UploadedFiles, UseInterceptors } from '@nestjs/common/decorators';
import { GetUser } from './decorators/get-user.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestPasswordResetDto } from './dto/request-pass.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profile_img', maxCount: 1 },
    { name: 'banner_multimedia', maxCount: 1 }
  ]))
  register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: { profile_img?: Express.Multer.File[], banner_multimedia?: Express.Multer.File[] }
  ) {
    const profileImagePath = files?.profile_img?.[0] ? `img/${files.profile_img[0].filename}` : null;
    const bannerImagePath = files?.banner_multimedia?.[0] ? `img/${files.banner_multimedia[0].filename}` : null;
    
    return this.usersService.create(createUserDto, profileImagePath, bannerImagePath);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post('logout')
  logoutUser(@Param('id', ParseUUIDPipe) id: string) {

    this.usersService.logout(id);
    
    return { message: 'Logout successful' };
  }

  @Get('all')
  getAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get('nickname/:nickname')
  findByNickname(@Param('nickname') nickname: string) {
    return this.usersService.findByNickname(nickname);
  }

  //calificar a usuario
  @Post(':userId/rate')
  @Auth( ValidRoles.user )
  async rateUser(@Param('userId') userId: string, @Body('rating') rating: number) {
      return this.usersService.rateUser(userId, rating);
  }

  //cambiar pass
  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(changePasswordDto.email, changePasswordDto.currentPassword, changePasswordDto.newPassword);
  }

  //restablecer pass
  @Post('request-password-reset')
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    await this.usersService.requestPasswordReset(requestPasswordResetDto.email);
    return { message: 'Solicitud de restablecimiento de contraseña enviada con éxito' };
  }

  //obtener seguidos del usuario
  @Get('following')
  @Auth( ValidRoles.user )
  getFollowing(@Req() req) {
    const followerId = req.user.id;
    return this.usersService.getFollowing(followerId);
  }

  //obtener seguidores del usuario
  @Get('followers')
  @Auth(ValidRoles.user)
  getFollowers(@Req() req) {
    const userId = req.user.id;
    return this.usersService.getFollowers(userId);
  }

  //Obtener info de un usuario
  @Get(':id')
  findOne(@Param('id') term: string) {
    return this.usersService.findOne(term);
  }

  //modificar informacion usuario
  @Patch('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<{ user: User; message: string }> {
    return this.usersService.updateUserData(id, updateUserDto);
  }

  //modificar imagenes del usuario
  @Patch('update-images/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profile_img', maxCount: 1 },
    { name: 'banner_multimedia', maxCount: 1 }
  ]))
  async updateImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: { profile_img?: Express.Multer.File[], banner_multimedia?: Express.Multer.File[] }
  ): Promise<{ user: User; message: string }> {
  const profileImagePath = files.profile_img?.[0]?.filename;
  const bannerImagePath = files.banner_multimedia?.[0]?.filename;

  return this.usersService.updateUserImages(id, profileImagePath, bannerImagePath);
  }

  //eliminar usuario
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
  
  ///////////////////////
  // Seccion SavedPost //
  ///////////////////////

  @Post('saved-post')
  @Auth( ValidRoles.user )
    async savePost(@Body() savePostDto: SavePostDto, @Req() req) {
    const userId = req.user.id;
    return this.usersService.savePost(userId, savePostDto.idPost);
  }

  @Delete('saved-post/:postId')
  @Auth( ValidRoles.user )
    async removeSavedPost(@Param('postId') postId: string, @Req() req) {
    const userId = req.user.id;
    return this.usersService.removeSavedPost(userId, postId);
  }

  @Get('saved-post/:idUser')
  @Auth( ValidRoles.user )
    async getSavedPosts(@Param('idUser', ParseUUIDPipe) idUser: string) {
    return this.usersService.getSavedPosts(idUser);
  }
  
  /////////////////////
  // Seccion Follows //
  /////////////////////

  @Post('follow')
  @Auth( ValidRoles.user )
  followUser(@Req() req, @Body() saveFollowDto: SaveFollowDto) {
    const followerId = req.user.id;
    return this.usersService.followUser(followerId, saveFollowDto.followingId);
  }

  @Delete('unfollow/:followingId')
  @Auth( ValidRoles.user )
  unfollowUser(@Req() req, @Param('followingId') followingId: string) {
    const followerId = req.user.id;
    return this.usersService.unfollowUser(followerId, followingId);
  }

}
