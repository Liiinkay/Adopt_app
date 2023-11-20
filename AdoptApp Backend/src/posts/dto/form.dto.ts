import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class FormDto {
    @IsString()
    @IsNotEmpty()
    id: string;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsNotEmpty()
    createdDate: Date;
  
    @IsString()
    @IsNotEmpty()
    city: string;
  
    @IsString()
    @IsNotEmpty()
    rut: string;
  
    @IsString()
    @IsNotEmpty()
    address: string;
  
    @IsString()
    @IsNotEmpty()
    phone: number;
  
    @IsString()
    @IsNotEmpty()
    question1: string;
  
    @IsBoolean()
    question2: boolean;
  
    @IsBoolean()
    question4: boolean;
  
    @IsString()
    @IsNotEmpty()
    question5: string;
  
    @IsString()
    @IsNotEmpty()
    question6: string;
  
    @IsBoolean()
    question7: boolean;
  
    @IsBoolean()
    question8: boolean;
  
    @IsBoolean()
    question9: boolean;
  
    @IsString()
    @IsNotEmpty()
    question10: string;
}