import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, IsOptional, IsUrl, IsEmpty, MinLength, Length } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateUserDto /*extends PartialType(CreateUserDto)*/ {
    @IsOptional()
    id: number;
    @ApiPropertyOptional()
    @IsOptional()
    @Length(2,10, { message: 'Длина имени должна быть от 2-х до 10-ти символов\n' })
    @IsString({ message: 'Имя должно быть строкой\n' })
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
