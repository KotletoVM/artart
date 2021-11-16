import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
export declare class AuthController {
    private readonly authService;
    private readonly emailConfirmationService;
    constructor(authService: AuthService, emailConfirmationService: EmailConfirmationService);
    login(req: any, response: Response): Promise<{
        email: string;
        sub: number;
    }>;
    register(createUserDto: CreateUserDto, response: Response): Promise<void>;
    refresh(req: any, response: Response): void;
    logOut(req: any, response: Response): Promise<void>;
}
