import { IsArray, IsDate, IsOptional, IsString, MinLength } from "class-validator"


export class CreateLostDto{
    
    @IsString()
    @MinLength(1)
    title: string;
  
    @IsString()
    description: string;
  
    @IsString()
    type: string;
  
    @IsString()
    state: string;
  
    @IsString()
    track_detail: string;
  
    @IsOptional()
    coordinates: string;

    @IsOptional()
    relevant_information: string;

    @IsOptional()
    latitude: string;

    @IsOptional()
    longitude: string;
}