import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty } from "class-validator";
//добавить проверки
export class LoginDto {
    email: string;
    password: string;
    fingerprint: string;
}