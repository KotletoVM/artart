import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Length, IsString, IsEmail, IsOptional, IsUrl, IsEmpty } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';


export class UpdateUserDto /*extends PartialType(CreateUserDto)*/ {
    @IsOptional()
    id: number;
    @IsOptional()
    @Length(2)
    @IsString()
    name?: string;
    @IsOptional()
    @IsUrl()
    userpic: string;
    @IsEmpty()
    password: string;
    @IsEmpty()
    role: UserRole;
    @IsEmpty()
    email: string;
}
