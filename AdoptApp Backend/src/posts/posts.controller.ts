import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateAdoptDto } from './dto/adopt-post.dto';
import { CreateLostDto } from './dto/lost-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Form } from './entities/form.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //agrear un nuevo posteo de tipo Adopcion 
  @Post('adopt/:id')
  async createAdoptPost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createAdoptDto: CreateAdoptDto,
  ) {
    const post = await this.postsService.createAdoptPost(id, createAdoptDto);
    return post;
  }

  //agrear un nuevo posteo de tipo perdido 
  @Post('lost/:id')
  async createLostPost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createLostDto: CreateLostDto,
  ) {
    const post = await this.postsService.createLostPost(id, createLostDto);
    return post;
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

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
