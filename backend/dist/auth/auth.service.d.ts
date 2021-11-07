import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
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
    login(user: User): Promise<{
        token: string;
        email: string;
        sub: number;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        user: {
            name: string;
            email: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
}
