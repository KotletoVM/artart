import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    text: string;

    @IsNotEmpty()
    personid: number;
}
