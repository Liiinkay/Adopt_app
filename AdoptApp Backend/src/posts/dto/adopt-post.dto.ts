import { IsArray, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateAdoptDto {

    @IsString()
    @MinLength(1)
    tittle: string

    @IsString()
    description: string

    @IsString()
    authorID: string

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
  
    @IsPositive()
    personality: string
  
    @IsPositive()
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
