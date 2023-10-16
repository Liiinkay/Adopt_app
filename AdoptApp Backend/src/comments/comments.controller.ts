import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  async createCommentLostPost(
    @Param('postId') postId: string,
    @Body() commentData: any,
    ) {
    // Lógica para crear un comentario principal
    const comment = await this.commentsService.createLostComment(postId, commentData);
    return comment;
  }
}
