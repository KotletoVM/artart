import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    getProfile(req: any): any;
    search(searchUserDto: SearchUserDto): Promise<{
        users: import("./entities/user.entity").User[];
        number: number;
    }>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
    }>;
    update(req: any, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    updatePassword(req: any, updateUserPasswordDto: UpdateUserPasswordDto): Promise<import("typeorm").UpdateResult>;
}
