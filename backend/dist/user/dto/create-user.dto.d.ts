import { UserRole } from "src/enums/role.enum";
export declare class CreateUserDto {
    id: number;
    name: string;
    email: string;
    userpic: string;
    password: string;
    role: UserRole[];
}
