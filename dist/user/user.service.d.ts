import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { HashedRefreshToken } from 'src/hashed-refresh-token/entities/hashed-refresh-token.entity';
import { Response } from 'express';
export declare class UserService {
    private userRepository;
    private tokenRepository;
    constructor(userRepository: Repository<User>, tokenRepository: Repository<HashedRefreshToken>);
    create(createUserDto: CreateUserDto): Promise<{
        name: string;
        email: string;
        hash: string;
        userpic: string;
    } & User>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    search(searchUserDto: SearchUserDto): Promise<{
        users: User[];
        number: number;
    }>;
    findByCond(cond: LoginUserDto): Promise<User>;
    getProfile(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        name: any;
        userpic: any;
    }>;
    updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto, response: Response): Promise<void>;
    updateEmail(id: number, updateUserEmailDto: UpdateUserEmailDto, response: Response): Promise<void>;
    updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    markEmailAsConfirmed(email: string): Promise<import("typeorm").UpdateResult>;
}
