import { IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRoleDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(UserRole, {message: 'Возможно указать 2 роли: admin или user'})
    role?: UserRole;
}
