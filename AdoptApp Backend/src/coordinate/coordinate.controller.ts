import { Controller, Post, Get, Patch, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoordinatesService } from './coordinate.service';
import { CreateCoordinatesDto } from './dto/create-coordinate.dto';

@Controller('coordinates')
export class CoordinatesController {
  constructor(private readonly coordinatesService: CoordinatesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCoordinatesDto: CreateCoordinatesDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.coordinatesService.create(createCoordinatesDto, image);
  }

  @Get()
  findAll() {
    return this.coordinatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordinatesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoordinatesDto: CreateCoordinatesDto
  ) {
    return this.coordinatesService.update(id, updateCoordinatesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordinatesService.remove(id);
  }
}