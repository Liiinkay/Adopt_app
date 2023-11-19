import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { SavedPost } from './entities/saved-post.entity';
import { Follows } from './entities/follows.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Form } from 'src/posts/entities/form.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

import { Informative } from '../posts/entities/typepost-entitys/informative-post.entity';
import { Lost } from 'src/posts/entities/typepost-entitys/lost-post.entity';
import { Adopt } from 'src/posts/entities/typepost-entitys/adopt-post.entity';
import { PostLikes } from '../posts/entities/post-like.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  controllers: [UsersController],
  providers: [ UsersService, JwtStrategy ],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([ User, Post, SavedPost, Follows, Form, Adopt, Lost, Informative, PostLikes ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        return{
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './img', // Directorio base para los archivos de usuario
        filename: (req, file, cb) => {
          const folder = file.fieldname === 'profile_img' ? 'profile' : 'banner';
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          cb(null, `${folder}/${randomName}${extname(file.originalname)}`); // Nombre de archivo aleatorio en la subcarpeta correspondiente
        },
      }),
    }),
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class UsersModule {}
