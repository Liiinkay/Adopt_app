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
import { PostLikes } from './entities/post-like.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path'; 

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`); // Nombre de archivo aleatorio
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Adopt, Informative, Lost, Post, PostMultimedia, Form, Report, Comment, PostLikes]),
  ],
})
export class PostsModule {}
