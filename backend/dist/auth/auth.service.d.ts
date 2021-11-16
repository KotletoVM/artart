import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response, Request } from 'express';
import { Repository } from 'typeorm';
import { HashedRefreshToken } from 'src/hashed-refresh-token/entities/hashed-refresh-token.entity';
import { CreateHashedRefreshTokenDto } from 'src/hashed-refresh-token/dto/create-hashed-refresh-token.dto';
import { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private userService;
    private jwtService;
    private tokenRepository;
    private userRepository;
    private configService;
    constructor(userService: UserService, jwtService: JwtService, tokenRepository: Repository<HashedRefreshToken>, userRepository: Repository<User>, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    generateJwtAccessToken(data: {
        id: number;
        email: string;
    }, secret: string, expiresIn: string): string;
    generateJwtRefreshToken(data: {
        id: number;
        email: string;
    }, secret: string, expiresIn: string): string;
    generateHash(password: string): Promise<string>;
    login(user: User, response: Response): Promise<{
        email: string;
        sub: number;
    }>;
    saveRefreshToken(createHashedRefreshTokenDto: CreateHashedRefreshTokenDto): void;
    register(createUserDto: CreateUserDto, response: Response): Promise<void>;
    getCookieWithJwtAccessToken(user: User, response: Response): void;
    getUserIfRefreshTokenMatches(refreshToken: string, userid: number): Promise<User>;
    logOut(user: User, req: Request, response: Response): Promise<void>;
}
