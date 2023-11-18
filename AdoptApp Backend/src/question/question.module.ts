import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './entities/question.entity';
import { Adopt } from 'src/posts/entities/typepost-entitys/adopt-post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [
    TypeOrmModule.forFeature([Adopt, Question]),
  ]
})
export class QuestionModule {}
