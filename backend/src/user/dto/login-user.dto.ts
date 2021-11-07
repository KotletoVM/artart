import { IsEmail, Length } from "class-validator";

export class LoginUserDto {
    //@Length(2)
    //name: string;
    @IsEmail()
    email: string;
    //@Length(6)
    //password?: string;
    //hash: string;
}
