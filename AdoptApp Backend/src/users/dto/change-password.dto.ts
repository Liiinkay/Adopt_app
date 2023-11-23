import { IsEmail, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    currentPassword: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}