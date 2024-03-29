import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";

export class CreateTagDto {
    @ApiResponseProperty()
    id: number;
    @ApiProperty()
    @IsNotEmpty({ message: 'Необходимо указать название тега\n' })
    @IsString({ message: 'Название тега должно быть строкой\n' })
    title: string;
}
