import { IsString } from "class-validator";


export class saveFollowerDto{

    @IsString()
    id: string

    @IsString()
    authorId: string;

    @IsString()
    followId: string;
}