import { IsEmail, Length, IsString, IsNotEmpty, Matches, IsOptional, IsUrl } from "class-validator";
import { UserRole } from "src/enums/role.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreateUserDto {
    id: number;
    @ApiProperty()
    @Length(2)
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    userpic: string;
    @ApiProperty()
    @Length(6)
    @IsNotEmpty()
    @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        { message: 'Weak password' },)
    password: string;
    @IsOptional()
    role: UserRole;
    //hash?: string;
}
