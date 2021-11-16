import { IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';

export class UpdateUserRoleDto {
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
