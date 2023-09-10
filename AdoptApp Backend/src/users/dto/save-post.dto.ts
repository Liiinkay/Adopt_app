import { IsString } from "class-validator";


export class SavePostDto{

    @IsString()
    id: string;
  
    @IsString()
    authorId: string;
  
    @IsString()
    idPost: string;
}