import { BadRequestException, Injectable, NotFoundException, Post, UseInterceptors } from '@nestjs/common';
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

    coordinates.imageURL = image ? `coordinates/${image.filename}` : null;
    try {
      await this.coordinatesRepository.save(coordinates);
      return coordinates;
    } catch (error) {
      throw new BadRequestException('Error al crear la entidad de coordenadas.');
    }
  }

  findAll(): Promise<Coordinates[]> {
    return this.coordinatesRepository.find();
  }

  async findOne(id: string): Promise<Coordinates> {
    const coordinates = await this.coordinatesRepository.findOneBy({ id });
    if (!coordinates) {
      throw new NotFoundException(`Coordenadas con ID ${id} no encontradas`);
    }
    return coordinates;
  }

  async update(id: string, updateCoordinatesDto: CreateCoordinatesDto): Promise<Coordinates> {
    const coordinates = await this.coordinatesRepository.preload({
      id: id,
      ...updateCoordinatesDto,
    });
    if (!coordinates) {
      throw new NotFoundException(`Coordenadas con ID ${id} no encontradas`);
    }
    try {
      return await this.coordinatesRepository.save(coordinates);
    } catch (error) {
      throw new BadRequestException('Error al actualizar la entidad de coordenadas.');
    }
  }

  async remove(id: string): Promise<void> {
    const coordinates = await this.findOne(id);
    try {
      await this.coordinatesRepository.remove(coordinates);
    } catch (error) {
      throw new BadRequestException('Error al eliminar la entidad de coordenadas.');
    }
  }
}