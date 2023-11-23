import { IsOptional, IsString, MinLength } from "class-validator";


export class UpdateInformativeDto {
    
    @IsString()
    @MinLength(1)
    title?: string

    @IsString()
    description?: string

    @IsString()
    type?: string
}