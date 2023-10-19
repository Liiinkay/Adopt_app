import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  async createCommentLostPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() commentData: CreateCommentDto,
    ) {
    // Lógica para crear un comentario principal
    const comment = await this.commentsService.createLostComment(postId, commentData);
    return comment;
  }

  @Post(':postId')
  async createCommentInformativePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() commentData: CreateCommentDto,
  ) {
    // Lógica para crear un comentario principal
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

  // Ruta para obtener todos los comentarios de una publicación de perdida
  @Get('lost/:postId')
  async getCommentsLostPost(
    @Param('postId',ParseUUIDPipe) postId: string
  ) {
    const comments = await this.commentsService.getCommentsForLostPost(postId);
    return comments;
  }

  // Ruta para obtener todos los comentarios de una publicación informativa
  @Get('informative/:postId')
  async getCommentsInformativePost(
    @Param('postId',ParseUUIDPipe) postId: string
  ) {
    const comments = await this.commentsService.getCommentsForInformativePost(postId);
    return comments;
  }

  // Ruta para eliminar un comentario por su ID
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    await this.commentsService.deleteComment(commentId);
    return { message: 'Comentario eliminado exitosamente' };
  }
}
