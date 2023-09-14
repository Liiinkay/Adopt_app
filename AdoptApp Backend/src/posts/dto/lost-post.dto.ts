import { IsArray, IsDate, IsOptional, IsString, MinLength } from "class-validator"


export class CreateLostDto{
    
    @IsString()
    @MinLength(1)
    title: string

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
    track_detail: string

    @IsDate()
    last_change: string

    @IsOptional()
    coordinates: string

    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    comment: string[]
}