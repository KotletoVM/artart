import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    generateJwtToken(data: {
        id: number;
        email: string;
    }): string;
    generateHash(password: string): Promise<string>;
    login(user: User, response: Response): Promise<{
        email: string;
        sub: number;
    }>;
    register(createUserDto: CreateUserDto, response: Response): Promise<void>;
}
