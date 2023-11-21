import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateCoordinatesDto } from './create-coordinate.dto';

export class UpdateCoordinateDto extends PartialType(CreateCoordinatesDto) {
    @IsNumber()
    @IsOptional()
    readonly latitude?: string;
  
    @IsNumber()
    @IsOptional()
    readonly longitude?: string;
  
    @IsString()
    @IsOptional()
    readonly title?: string;
  
    @IsString()
    @IsOptional()
    readonly description?: string;
  
    @IsString()
    @IsOptional()
    readonly imageURL?: string;
}
