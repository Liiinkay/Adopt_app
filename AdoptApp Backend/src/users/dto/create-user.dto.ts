import { IsArray, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateUserDto {

    @IsString()
    @MinLength(1)
    nickname: string;

    @IsString()
    name: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    banner_multimedia: string;

    @IsString()
    @IsOptional()
    profile_img: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsString()
    @IsOptional()
    rut: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    phone_number: number;

    @IsString()
    @IsOptional()
    contact_email: string;

    @IsString()
    @IsOptional()
    instagram: string;

    @IsString()
    @IsOptional()
    facebook: string;

    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    post: string[];

    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    saved_post?: string[];

    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    followers?: string[];

    @IsString({ each:true })
    @IsArray()
    @IsOptional()
    follows?: string[];
}   

