import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Adopt } from './entities/typepost-entitys/adopt-post.entity';
import { Lost } from './entities/typepost-entitys/lost-post.entity';
import { Informative } from './entities/typepost-entitys/informative-post.entity';
import { PostMultimedia } from './entities/multimedia-post.entity';
import { Form } from './entities/form.entity';
import { Report } from '../reports/entities/report.entity';
import { Comment } from '../comments/entities/comment.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    TypeOrmModule.forFeature([ User, Adopt, Informative, Lost, Post, PostMultimedia, Form, Report, Comment ])
  ]
})
export class PostsModule {}
