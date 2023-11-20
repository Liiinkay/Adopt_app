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

  //agregar un nuevo posteo de tipo adopcion
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

  //actualizar informacion de un post
  @Patch(':id')
  async updatePost(@Param('id', ParseUUIDPipe) id: string, @Body() updatePostDto: any): Promise<any> {
    return await this.postsService.updatePost(id, updatePostDto);
  }

  //eliminar Post
  @Delete(':id')
  async deletePost(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    await this.postsService.deletePost(id);
    return { message: 'Posteo Borrado con Exito' };
  }

  //obtener post por Id
  @Get(':id')
  async getPostById(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.getPostById(id);
  }

  //obtener todos los post de un tipo de publicacion
  @Get('type/:type')
  async getPostsByType(@Param('type') type: string) {
    return this.postsService.getPostsByType(type);
  }

  //obtener todos los posteos de todo tipo por usuario
  @Get('/user/:id')
  async getUserPostsJson(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.getUserPostsJson(id);
  }

  /////////////////////////
  // Seccion lIKE/UNLIKE //
  /////////////////////////

  //Like
  @Post(':postId/like')
  async likePost(@Param('postId') postId: string, @Body('userId') userId: string) {
      return this.postsService.likePost(postId, userId);
  }

  //Unlike
  @Delete(':postId/like')
  async unlikePost(@Param('postId') postId: string, @Body('userId') userId: string) {
      return this.postsService.unlikePost(postId, userId);
  }

  ////////////////////////
  // Seccion Formulario //
  ////////////////////////
  
  //agregar formulario 
  @Post('adopt/:idPost/form/:idApplicant')
  async createFormAdopt(  
    @Param('idPost', ParseUUIDPipe) idPost: string,
    @Param('idApplicant', ParseUUIDPipe) idApplicant: string,
    @Body() formData: Partial<Form>,
  ): Promise<Form> {
    return this.postsService.createFormAdoption(idPost, idApplicant, formData);
  }

  //get de formularios x id del post
  @Get('forms/:idPost')
  async getFormsByPostId(@Param('idPost', ParseUUIDPipe) idPost: string) {
      const forms = await this.postsService.getFormsByPostId(idPost);
      return forms;
  }

  //get de formularios x id del usuario postulante
  @Get('userAppliedPosts/:idUser')
  async getPostsAppliedByUserId(@Param('idUser', ParseUUIDPipe) idUser: string) {
      const posts = await this.postsService.getPostsAppliedByUserId(idUser);
      return posts;
  }

  ////////////////////////
  // Seccion Imagenes   //
  ////////////////////////

  //cambio de imagenes de los posteos.
  @Patch(':id/images')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 }
  ]))
  async updatePostImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] }
  ) {
    const mediaUrls = files.images.map(file => `uploads/${file.filename}`);
    return this.postsService.updatePostImages(id, mediaUrls);
  }
}


