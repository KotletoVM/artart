import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
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
