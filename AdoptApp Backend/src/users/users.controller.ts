import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SavePostDto } from './dto/save-post.dto';
import { SaveFollowDto } from './dto/save-follow.dto';

import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Req, SetMetadata } from '@nestjs/common/decorators';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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

  @Post(':userId/rate')
  @Auth( ValidRoles.user )
  async rateUser(@Param('userId') userId: string, @Body('rating') rating: number) {
      return this.usersService.rateUser(userId, rating);
  }

  //@Get()
  //findAll(){
  //  return this.usersService.findAll();
  //}

  @Get('private3')
  @Auth( ValidRoles.user )
  privateRoute3(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }
  }

  @Get('following')
  @Auth( ValidRoles.user )
  getFollowing(@Req() req) {
    const followerId = req.user.id;
    return this.usersService.getFollowing(followerId);
  }

  @Get('followers')
  @Auth(ValidRoles.user)
  getFollowers(@Req() req) {
    const userId = req.user.id;
    return this.usersService.getFollowers(userId);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
  
  //Seccion SavedPost

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
  
  //Seccion Follows

  @Post('follow')
  @Auth( ValidRoles.user )
  followUser(@Req() req, @Body() saveFollowDto: SaveFollowDto) {
    const followerId = req.user.id; // Asegúrate de obtener el ID del usuario actual
    return this.usersService.followUser(followerId, saveFollowDto.followingId);
  }

  @Delete('unfollow/:followingId')
  @Auth( ValidRoles.user )
  unfollowUser(@Req() req, @Param('followingId') followingId: string) {
    const followerId = req.user.id;
    return this.usersService.unfollowUser(followerId, followingId);
  }
}
