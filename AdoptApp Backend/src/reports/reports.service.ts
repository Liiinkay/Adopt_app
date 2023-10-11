import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Adopt } from 'src/posts/entities/typepost-entitys/adopt-post.entity';
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
  ) {}

  async createAdoptReport(userId: string, postId: string, createReportDto: CreateReportDto): Promise<Report> {

    try {
        const adoptPost = await this.adoptRepository.findOneBy({ id: postId })

        if (!adoptPost) {
          throw new NotFoundException(`Adopt Post with ID ${postId} not found`);
        }

        console.log(adoptPost)

        const report = new Report();
        report.userId = userId;
        report.postId = postId; // ID del posteo a reportar
        report.reason = createReportDto.reason;
        report.post = adoptPost;
        report.type = adoptPost.type;

        console.log(report)

        // Guardar el informe en la base de datos
        return this.reportRepository.save(report);

        // Código para insertar el reporte aquí
      } catch (error) {
        console.error('Error al insertar el reporte:', error);
        throw error; // Lanza nuevamente el error para que NestJS lo maneje
      }

  }
}
