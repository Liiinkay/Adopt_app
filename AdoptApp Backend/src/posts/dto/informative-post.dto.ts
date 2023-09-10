import { IsArray, IsDate, IsOptional, IsString, MinLength } from "class-validator"

export class createInformativeDto{
    
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
}