import { IsArray, IsDate, IsOptional, IsString, MinLength } from "class-validator"

export class createInformativeDto{
    
    @IsString()
    @MinLength(1)
    tittle: string

    @IsString()
    description: string

    @IsString()
    type: string

}