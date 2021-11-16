import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    getProfile(req: any): Promise<import("./entities/user.entity").User>;
    search(searchUserDto: SearchUserDto): Promise<{
        users: import("./entities/user.entity").User[];
        number: number;
    }>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        userpic: string;
        isEmailConfirmed: boolean;
    }>;
    update(req: any, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    updatePassword(req: any, updateUserPasswordDto: UpdateUserPasswordDto): Promise<import("typeorm").UpdateResult>;
    updateEmail(req: any, updateUserEmailDto: UpdateUserEmailDto): Promise<import("typeorm").UpdateResult>;
    updateRole(req: any, updateUserRoleDto: UpdateUserRoleDto): Promise<import("typeorm").UpdateResult>;
    remove(req: any): Promise<import("typeorm").DeleteResult>;
}
