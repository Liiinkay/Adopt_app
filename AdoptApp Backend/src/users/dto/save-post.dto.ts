import { IsString } from "class-validator";


export class SavePostDto{
    @IsString()
    idPost: string;
}