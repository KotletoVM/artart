import { Length, IsString, IsEmail, IsOptional, Matches } from 'class-validator';

export class UpdateUserEmailDto {
    @IsOptional()
    @IsEmail()
    email?: string;
}