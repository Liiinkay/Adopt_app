import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { SavedPost } from './entities/saved-post.entity';
import { Followers } from './entities/followers.entity';
import { Follows } from './entities/follows.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([ User, Post, SavedPost, Followers, Follows ])
  ]
})
export class UsersModule {}
