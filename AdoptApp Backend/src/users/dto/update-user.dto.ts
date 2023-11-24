import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @MinLength(1)
    nickname: string;

    @IsString()
    name: string;
    
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
