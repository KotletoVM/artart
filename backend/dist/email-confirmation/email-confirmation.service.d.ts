import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class EmailConfirmationService {
    private readonly userService;
    private readonly configService;
    private readonly jwtService;
    private nodemailerTransport;
    constructor(userService: UserService, configService: ConfigService, jwtService: JwtService);
    confirmEmail(email: string): Promise<string>;
    decodeConfirmationToken(token: string): Promise<any>;
    sendMail(options: Mail.Options): Promise<any>;
    sendVerificationLink(email: string): Promise<any>;
    resendConfirmationLink(userId: number): Promise<void>;
}
