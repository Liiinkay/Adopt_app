import { Injectable, NotFoundException, Post, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coordinates } from './entities/coordinate.entity';
import { CreateCoordinatesDto } from './dto/create-coordinate.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class CoordinatesService {
  constructor(
    @InjectRepository(Coordinates)
    private readonly coordinatesRepository: Repository<Coordinates>,
  ) {}

  async create(createCoordinatesDto: CreateCoordinatesDto, image?: Express.Multer.File): Promise<Coordinates> {
    const coordinates = this.coordinatesRepository.create(createCoordinatesDto);
    // Establece imageURL a null si no se proporciona ninguna imagen
    coordinates.imageURL = image ? `coordinates/${image.filename}` : null;
    await this.coordinatesRepository.save(coordinates);
    return coordinates;
  }

  findAll(): Promise<Coordinates[]> {
    return this.coordinatesRepository.find();
  }

  async findOne(id: string): Promise<Coordinates> {
    const coordinates = await this.coordinatesRepository.findOneBy({ id });
    if (!coordinates) {
      throw new NotFoundException(`Coordinates with ID ${id} not found`);
    }
    return coordinates;
  }

  async update(id: string, updateCoordinatesDto: CreateCoordinatesDto): Promise<Coordinates> {
    const coordinates = await this.coordinatesRepository.preload({
      id: id,
      ...updateCoordinatesDto,
    });
    if (!coordinates) {
      throw new NotFoundException(`Coordinates with ID ${id} not found`);
    }
    return this.coordinatesRepository.save(coordinates);
  }

  async remove(id: string): Promise<void> {
    const coordinates = await this.findOne(id);
    await this.coordinatesRepository.remove(coordinates);
  }
}