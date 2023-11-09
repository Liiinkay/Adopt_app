import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Adopt } from 'src/posts/entities/typepost-entitys/adopt-post.entity';
import { Informative } from 'src/posts/entities/typepost-entitys/informative-post.entity';
import { Lost } from 'src/posts/entities/typepost-entitys/lost-post.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Adopt)
    private readonly adoptRepository: Repository<Adopt>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Lost)
    private readonly lostRepository: Repository<Lost>,
    @InjectRepository(Informative)
    private readonly informativeRepository: Repository<Informative>,
  ) {}

  async createAdoptReport(userId: string, postId: string, createReportDto: CreateReportDto): Promise<Report> {

    const post = await this.adoptRepository.findOneBy({ id: postId });

    if (!post) {
      throw new NotFoundException('Adopt post not found');
    }

    const report = this.reportRepository.create({
      reason: createReportDto.reason,
      userId: userId,
      postId: postId,
      type: 'adopt',
      adoptPost: post,
    });
    return this.reportRepository.save(report);
  }

  async createLostReport(userId: string, postId: string, createReportDto: CreateReportDto): Promise<Report> {

    const post = await this.lostRepository.findOneBy({ id: postId });

    if (!post) {
      throw new NotFoundException('Adopt post not found');
    }

    const report = this.reportRepository.create({
      reason: createReportDto.reason,
      userId: userId,
      postId: postId,
      type: 'adopt',
      lostPost: post,
    });
    return this.reportRepository.save(report);

  }

  async createInformativeReport(userId: string, postId: string, createReportDto: CreateReportDto): Promise<Report> {

    const post = await this.informativeRepository.findOneBy({ id: postId });

    if (!post) {
      throw new NotFoundException('Adopt post not found');
    }

    const report = this.reportRepository.create({
      reason: createReportDto.reason,
      userId: userId,
      postId: postId,
      type: 'adopt',
      informativePost: post,
    });
    return this.reportRepository.save(report);

  }
}
