import { Length, IsString, IsEmail, IsOptional, Matches } from 'class-validator';

export class UpdateUserEmailDto /*extends PartialType(CreateUserDto)*/ {
    @IsOptional()
    id: number;
    @IsOptional()
    @IsEmail()
    email?: string;
}