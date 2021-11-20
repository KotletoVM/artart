import { IsEmail, Length, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    //@Length(2)
    //name: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    //@Length(6)
    //password?: string;
    //hash: string;
}
