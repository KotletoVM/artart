import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { Response } from 'express';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
export declare class UserController {
    private readonly emailConfirmationService;
    private readonly userService;
    constructor(emailConfirmationService: EmailConfirmationService, userService: UserService);
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
    }>;
    update(req: any, updateUserDto: UpdateUserDto): Promise<{
        name: any;
        userpic: any;
    }>;
    updatePassword(req: any, updateUserPasswordDto: UpdateUserPasswordDto, responce: Response): Promise<void>;
    updateEmail(req: any, updateUserEmailDto: UpdateUserEmailDto, responce: Response): Promise<void>;
    updateRole(req: any, updateUserRoleDto: UpdateUserRoleDto): Promise<import("typeorm").UpdateResult>;
    remove(req: any): Promise<import("typeorm").DeleteResult>;
}
