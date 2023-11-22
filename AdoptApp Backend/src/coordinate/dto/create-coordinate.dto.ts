import { IsString } from "class-validator";

export class CreateCoordinatesDto {
  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
  }