import { IsArray, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateAdoptDto {

    @IsString()
    @MinLength(1)
    title: string

    @IsString()
    description: string

    @IsString()
    type: string

    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    multimedia: string[]

    @IsString()
    state: string;
  
    @IsString()
    gender: string
  
    @IsNumber()
    @IsPositive()
    @IsOptional()
    age: number
  
    @IsString()
    @IsOptional()
    personality: string
  
    @IsString()
    @IsOptional()
    medical_information: string
  
    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    form: string[]
  
    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    coment: string[]

}
