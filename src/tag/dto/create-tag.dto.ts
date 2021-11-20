import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTagDto {
    id: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;
}
