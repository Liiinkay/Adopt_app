import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { Lost } from '../posts/entities/typepost-entitys/lost-post.entity';
import { Informative } from '../posts/entities/typepost-entitys/informative-post.entity';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([ Post, Lost, Informative, Comment ])
  ],
  exports: [TypeOrmModule]
})


export class CommentsModule {}
