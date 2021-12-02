import { IsEmail, IsString, IsNotEmpty, Matches, IsOptional, IsUrl, IsEmpty, MinLength, Length } from "class-validator";
import { UserRole } from "src/enums/role.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreateUserDto {
    id: number;
    @ApiProperty()
    @IsNotEmpty({ message: 'Имя необходимо заполнить\n' })
    @Length(2,10, { message: 'Длина имени должна быть от 2-х до 10-ти символов\n' })
    @IsString({ message: 'Имя должно быть строкой\n' })
    name: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Email необходимо заполнить\n' })
    @IsEmail({}, {message: 'Введите корректный email\n'})
    email: string;
    @IsEmpty()
    userpic: string;
    @ApiProperty()
    @MinLength(6, { message: 'Минимальная длина пароля: 6 символов\n' })
    @IsNotEmpty({ message: 'Пароль необходимо заполнить\n' })
    @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        { message: 'Пароль должен содержать буквы и цифры\n' })
    password: string;
    @IsOptional()
    role: UserRole;
    //hash?: string;
}
