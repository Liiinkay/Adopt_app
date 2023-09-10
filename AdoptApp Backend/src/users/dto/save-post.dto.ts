import { IsString } from "class-validator";


export class SavePostDto{
    @IsString()
    authorId: string;
  
    @IsString()
    idPost: string;
}