import { IsArray, IsDate, IsOptional, IsString, MinLength } from "class-validator"


export class createLostDto{
    
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
    track_detal: string

    @IsDate()
    last_change: string

    @IsOptional()
    coordinates: string

    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    coment: string[]
}