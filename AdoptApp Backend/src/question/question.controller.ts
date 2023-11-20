import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post(':postId')
  async createQuestion(
      @Param('postId') postId: string, 
      @Body() createQuestionDto: CreateQuestionDto
  ) {
      return this.questionService.createQuestion(postId, createQuestionDto);
  }

  @Patch('answer/:questionId')
  async answerQuestion(
      @Param('questionId') questionId: string, 
      @Body('answer') answer: string
  ) {
      return this.questionService.answerQuestion(questionId, answer);
  }

  @Get(':postId')
  async getQuestionsByPostId(@Param('postId') postId: string) {
      return this.questionService.getQuestionsByPostId(postId);
  }

  @Delete(':questionId')
  async deleteQuestion(@Param('questionId') questionId: string) {
      await this.questionService.deleteQuestion(questionId);
      return { message: 'Question successfully deleted' };
  }

}
