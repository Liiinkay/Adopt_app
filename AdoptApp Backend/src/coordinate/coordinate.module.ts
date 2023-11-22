import { Module } from '@nestjs/common';
import { CoordinatesService } from './coordinate.service';
import { CoordinatesController } from './coordinate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinates } from './entities/coordinate.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  controllers: [CoordinatesController],
  providers: [CoordinatesService],
  imports: [
    TypeOrmModule.forFeature([Coordinates]),
    MulterModule.register({
      storage: diskStorage({
        destination: './img/coordinates',
        filename: (req, file, cb) => {
          // genera un nombre de archivo único
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
})
export class CoordinateModule {}
