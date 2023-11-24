import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';


export class FormDto {
    @IsString()
    @IsOptional()
    id: string;
  
    @IsString()
    @IsOptional()
    name: string;
  
    @IsString()
    @IsOptional()
    city: string;
  
    @IsString()
    @IsOptional()
    rut: string;
  
    @IsString()
    @IsOptional()
    address: string;
  
    @IsNumber()
    @IsOptional()
    phone: number;
  
    @IsString()
    @IsOptional()
    question1: string;
  
    @IsBoolean()
    @IsOptional()
    question2: boolean;
  
    @IsBoolean()
    @IsOptional()
    question4: boolean;
  
    @IsString()
    @IsOptional()
    question5: string;
  
    @IsString()
    @IsOptional()
    question6: string;
  
    @IsBoolean()
    @IsOptional()
    question7: boolean;
  
    @IsBoolean()
    @IsOptional()
    question8: boolean;
  
    @IsBoolean()
    @IsOptional()
    question9: boolean;
  
    @IsString()
    @IsOptional()
    question10: string;
}