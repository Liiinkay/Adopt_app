import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Adopt } from 'src/posts/entities/typepost-entitys/adopt-post.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService { 
    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(Adopt)
        private adoptRepository: Repository<Adopt>
    ) {}

    async createQuestion(postId: string, createQuestionDto: CreateQuestionDto): Promise<Question> {
        const post = await this.adoptRepository.findOneBy({ id: postId });
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
        const question = this.questionRepository.create({
            ...createQuestionDto,
            adoptPost: post,
            author: createQuestionDto.authorId
        });
        return this.questionRepository.save(question);
    }

    async answerQuestion(questionId: string, answer: string): Promise<Question> {
        const question = await this.questionRepository.findOneBy({ id: questionId });
        if (!question) {
            throw new NotFoundException(`Question with ID ${questionId} not found`);
        }
        question.answer = answer;
        return this.questionRepository.save(question);
    }

    async getQuestionsByPostId(postId: string): Promise<Question[]> {
        const questions = await this.questionRepository.find({
            where: { adoptPost: { id: postId } },
            relations: ['adoptPost']
        });
        return questions;
    }

    async deleteQuestion(questionId: string): Promise<void> {
        const question = await this.questionRepository.findOneBy({ id: questionId });
        if (!question) {
            throw new NotFoundException(`Question with ID ${questionId} not found`);
        }
        await this.questionRepository.remove(question);
    }
}
