import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<{
        name: string;
        email: string;
        hash: string;
    } & User>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User>;
    search(searchUserDto: SearchUserDto): Promise<{
        users: User[];
        number: number;
    }>;
    findByCond(cond: LoginUserDto): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto): Promise<import("typeorm").UpdateResult>;
}
