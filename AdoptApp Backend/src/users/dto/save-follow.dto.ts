import { IsString } from "class-validator";


export class SaveFollowDto{
    
    @IsString()
    followingId: string;
}