import { IsString } from "class-validator";

export class CreateReportDto {
    @IsString()
    reason: string;
}
