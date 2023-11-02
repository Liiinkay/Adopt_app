import { IsArray, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { SavedPost } from '../entities/saved-post.entity';


export class LoginUserDto {

    @IsString()
    @MinLength(1)
    nickname: string;

    @IsString()
    password: string;
}   