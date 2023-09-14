import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Adopt } from './entities/adopt-post.entity';
import { Lost } from './entities/lost-post.entity';
import { Informative } from './entities/informative-post.entity';
import { PostMultimedia } from './entities/multimedia-post.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    TypeOrmModule.forFeature([ User, Adopt, Informative, Lost, Post, PostMultimedia ])
  ]
})
export class PostsModule {}
