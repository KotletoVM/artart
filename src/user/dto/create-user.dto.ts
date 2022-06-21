import { IsEmail, IsString, IsNotEmpty, Matches, IsOptional, IsUrl, IsEmpty, MinLength, Length } from "class-validator";
import { UserRole } from "src/enums/role.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class CreateUserDto {
    id: number;
    @ApiProperty()
    @IsNotEmpty({ message: 'Необходимо ввести псевдоним\n'})
    @Length(2,10, { message: 'Длина имени должна быть от 2 до 10 символов\n' })
    @IsString({ message: 'Псевдоним должен быть строкой\n'})
    name: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Необходимо ввести e-mail\n' })
    @IsEmail({}, {message: 'E-mail введен некорректно\n'})
    email: string;
    @IsEmpty()
    userpic: string;
    @ApiProperty()
    @MinLength(6, { message: 'Длина имени должна быть от 6 символов\n' })
    @IsNotEmpty({ message: 'Необходимо ввести пароль\n' })
    @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        { message: 'Пароль должен содержать буквы и цифры\n' })
    password: string;
    @IsEmpty({message: "Роль указать нельзя!"})
    role: UserRole;
}
