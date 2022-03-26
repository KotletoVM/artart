import { Length, IsString, IsEmail, IsOptional, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserEmailDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail({}, {message: 'Введите корректный email\n'})
    email?: string;
}