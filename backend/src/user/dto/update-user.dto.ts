import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Length, IsString, IsEmail, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto /*extends PartialType(CreateUserDto)*/ {
    @IsOptional()
    id: number;
    @IsOptional()
    @Length(2)
    @IsString()
    name?: string;
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    role: UserRole;
}
