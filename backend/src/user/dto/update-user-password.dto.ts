//import { PartialType } from '@nestjs/mapped-types';
//import { CreateUserDto } from './create-user.dto';
import { Length, IsString, IsEmail, IsOptional, Matches } from 'class-validator';

export class UpdateUserPasswordDto /*extends PartialType(CreateUserDto)*/ {
    @IsOptional()
    id: number;
    @IsOptional()
    @Length(6)
    @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        { message: 'Weak password' },)
    password?: string;
}
