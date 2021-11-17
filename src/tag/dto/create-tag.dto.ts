import { IsString, IsNotEmpty } from "class-validator";

export class CreateTagDto {
    id: number;
    @IsNotEmpty()
    @IsString()
    title: string;
}
