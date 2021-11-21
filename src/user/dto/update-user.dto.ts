import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Length, IsString, IsEmail, IsOptional, IsUrl, IsEmpty } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateUserDto /*extends PartialType(CreateUserDto)*/ {
    @IsOptional()
    id: number;
    @ApiPropertyOptional()
    @IsOptional()
    @Length(2)
    @IsString()
    name?: string;
    @IsEmpty()
    userpic: string;
    @IsEmpty()
    password: string;
    @IsEmpty()
    role: UserRole;
    @IsEmpty()
    email: string;
}
