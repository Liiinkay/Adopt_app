import { IsArray, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { SavedPost } from '../entities/saved-post.entity';


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
    
    @IsString()
    @IsOptional()
    phone_number: string;

    @IsString()
    @IsOptional()
    contact_email: string;

    @IsString()
    @IsOptional()
    instagram: string;

    @IsString()
    @IsOptional()
    facebook: string;

    @IsString()
    @IsOptional()
    region: string;

    @IsString()
    @IsOptional()
    city: string;
}   

