import { IsString, IsEmail, IsOptional, Matches, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
    @ApiPropertyOptional()
    @IsOptional()
    @MinLength(6, { message: 'Минимальная длина пароля: 6 символов\n' })
    @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        { message: 'Пароль должен содержать буквы и цифры\n' })
    password?: string;
}
