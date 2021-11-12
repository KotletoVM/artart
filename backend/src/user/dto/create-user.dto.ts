import { IsEmail, Length, IsString, IsNotEmpty, Matches, IsOptional, IsUrl } from "class-validator";
import { UserRole } from "src/enums/role.enum";


export class CreateUserDto {
    id: number;
    @Length(2)
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsOptional()
    @IsUrl()
    userpic: string;
    @Length(6)
    @IsNotEmpty()
    @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        { message: 'Weak password' },)
    password: string;
    @IsOptional()
    role: UserRole[];
    //hash?: string;
}
