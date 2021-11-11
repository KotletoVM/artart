import { IsEmail, Length, IsNotEmpty } from "class-validator";

export class LoginUserDto {
    //@Length(2)
    //name: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    //@Length(6)
    //password?: string;
    //hash: string;
}
