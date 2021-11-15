import { Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
declare const JwtRefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshTokenStrategy extends JwtRefreshTokenStrategy_base {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(req: Request, payload: {
        sub: number;
        email: string;
    }): Promise<import("../../user/entities/user.entity").User>;
}
export {};
