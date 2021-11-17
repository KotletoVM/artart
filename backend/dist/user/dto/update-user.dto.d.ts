import { UserRole } from 'src/enums/role.enum';
export declare class UpdateUserDto {
    id: number;
    name?: string;
    userpic: string;
    password: string;
    role: UserRole;
    email: string;
}
