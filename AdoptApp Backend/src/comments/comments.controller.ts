import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('lost/:postId')
  async createCommentLostPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() commentData: CreateCommentDto,
    ) {
    const comment = await this.commentsService.createLostComment(postId, commentData);
    return comment;
  }

  @Post('informative/:postId')
  async createCommentInformativePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() commentData: CreateCommentDto,
  ) {
    const comment = await this.commentsService.createInformativeComment(postId, commentData);
    return comment;
  }

  // Ruta para crear una respuesta a un comentario
  @Post('reply/:commentId')
  async createReply(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() commentData: any
  ) {
    const reply = await this.commentsService.createReply(commentId, commentData);
    return reply;
  }

  // Get comentarios de un post mas la informacion de este por ID
  @Get('/:postId/with-comments')
  async getPostWithComments(@Param('postId', ParseUUIDPipe) postId: string) {
    return await this.commentsService.getPostWithComments(postId);
  }

  @Get('/:postId/comments')
  async getCommentsByPostId(@Param('postId', ParseUUIDPipe) postId: string) {
    return await this.commentsService.getCommentsByPostId(postId);
  }

  // Ruta para eliminar un comentario por su ID
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    await this.commentsService.deleteComment(commentId);
    return { message: 'Comentario eliminado exitosamente' };
  }
}
