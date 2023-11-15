import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateAdoptDto } from './dto/adopt-post.dto';
import { CreateLostDto } from './dto/lost-post.dto';
import { createInformativeDto } from './dto/informative-post.dto'
import { UpdatePostDto } from './dto/update-post.dto';
import { Form } from './entities/form.entity';
import { Auth } from 'src/users/decorators/auth.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('adopt/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }
  ]))
  async createAdoptPost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createAdoptDto: CreateAdoptDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    const mediaUrls = files.images.map(file => `uploads/${file.filename}`);
    return this.postsService.createAdoptPost(id, createAdoptDto, mediaUrls);
  }

  //agrear un nuevo posteo de tipo perdido 
  @Post('lost/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }
  ]))
  async createLostPost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createLostDto: CreateLostDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    const mediaUrls = files.images.map(file => `uploads/${file.filename}`);
    return this.postsService.createLostPost(id, createLostDto, mediaUrls);
  }

  //agrear un nuevo posteo de tipo informativo
  @Post('informative/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }
  ]))
  async createInformativePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createInformativeDto: createInformativeDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    const mediaUrls = files.images.map(file => `uploads/${file.filename}`);
    return this.postsService.createInformativePost(createInformativeDto, id, mediaUrls);
  }

  //agregar formulario 
  @Post('adopt/:idPost/form/:idApplicant')
  async createFormAdopt(  
    @Param('idPost', ParseUUIDPipe) idPost: string,
    @Param('idApplicant', ParseUUIDPipe) idApplicant: string,
    @Body() formData: Partial<Form>,
  ): Promise<Form> {
    return this.postsService.createFormAdoption(idPost, idApplicant, formData);
  }

  @Get('/:userId')
  async getUserPosts(@Param('userId') userId: string): Promise<any[]> {
    const userPosts = await this.postsService.getUserPostsJson(userId);
    return userPosts;
  }

  @Patch(':id')
  async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<any> {
    const updatedPost = await this.postsService.updatePost(id, updatePostDto);
    return updatedPost;
  }

  //Seccion LikePosts

  @Post(':postId/like')
  async likePost(@Param('postId') postId: string, @Body('userId') userId: string) {
      return this.postsService.likePost(postId, userId);
  }

  @Delete(':postId/like')
  async unlikePost(@Param('postId') postId: string, @Body('userId') userId: string) {
      return this.postsService.unlikePost(postId, userId);
  }
}
