import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty } from "class-validator";
//добавить проверки
export class LoginDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    @IsNotEmpty()
    fingerprint: string;
}