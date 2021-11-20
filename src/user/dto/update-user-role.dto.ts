import { IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRoleDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
