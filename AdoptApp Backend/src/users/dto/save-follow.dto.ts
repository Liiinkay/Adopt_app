import { IsString } from "class-validator";


export class saveFollowDto{
    
    @IsString()
    id: string

    @IsString()
    authorId: string;

    @IsString()
    followerId: string;
}