import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Length, IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';


export class UpdateUserDto /*extends PartialType(CreateUserDto)*/ {
    @IsOptional()
    id: number;
    @IsOptional()
    @Length(2)
    @IsString()
    name?: string;
    @IsOptional()
    role: UserRole[];
    @IsOptional()
    @IsUrl()
    userpic: string;
}
