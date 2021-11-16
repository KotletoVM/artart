import { UserRole } from 'src/enums/role.enum';
export declare class User {
    id: number;
    name: string;
    email: string;
    hash: string;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    userpic: string;
    isEmailConfirmed: boolean;
}
