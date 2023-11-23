import { IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    authorId: string
  }