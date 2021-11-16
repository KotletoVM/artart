import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class EmailConfirmationService {
    private readonly configService;
    private readonly jwtService;
    private readonly userService;
    private nodemailerTransport;
    constructor(configService: ConfigService, jwtService: JwtService, userService: UserService);
    confirmEmail(email: string): Promise<void>;
    decodeConfirmationToken(token: string): Promise<any>;
    sendMail(options: Mail.Options): Promise<any>;
    sendVerificationLink(email: string): Promise<any>;
}