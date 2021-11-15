import { UserRole } from 'src/enums/role.enum';
export declare class UpdateUserDto {
    id: number;
    name?: string;
    role: UserRole;
    userpic: string;
}
