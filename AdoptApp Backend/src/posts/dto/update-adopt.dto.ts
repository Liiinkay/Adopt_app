import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateAdoptDto {
    @IsString()
    @MinLength(1)
    title?: string

    @IsString()
    description?: string

    @IsString()
    type?: string

    @IsString()
    state?: string;
  
    @IsString()
    gender?: string
    
    @IsString()
    @IsOptional()
    age?: string
  
    @IsString()
    @IsOptional()
    personality?: string
  
    @IsString()
    @IsOptional()
    medical_information?: string
}