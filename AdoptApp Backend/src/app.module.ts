import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ReportsModule } from './reports/reports.module';
import { CommentsModule } from './comments/comments.module';
import { QuestionModule } from './question/question.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CoordinateModule } from './coordinate/coordinate.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,

    PostsModule,

    ReportsModule,

    CommentsModule,

    QuestionModule,
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/api/uploads',
    },
    {
      rootPath: join(__dirname, '..', 'img/profile'),
      serveRoot: '/api/img/profile',
    },
    {
      rootPath: join(__dirname, '..', 'img/banner'), 
      serveRoot: '/api/img/banner',
    },
    ),
    
    CoordinateModule,
  ],
})
export class AppModule {}