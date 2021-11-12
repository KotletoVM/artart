import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any, response: Response): Promise<{
        email: string;
        sub: number;
    }>;
    register(createUserDto: CreateUserDto, response: Response): Promise<void>;
}
