import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Adopt } from '../posts/entities/typepost-entitys/adopt-post.entity';
import { Lost } from '../posts/entities/typepost-entitys/lost-post.entity';
import { Report } from './entities/report.entity';
import { Informative } from '../posts/entities/typepost-entitys/informative-post.entity';


@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [
    TypeOrmModule.forFeature([ User, Adopt, Lost, Post, Report, Informative ])
  ]
})
export class ReportsModule {}
