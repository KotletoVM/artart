import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { jwtSecret } from '../constants/jwt-secret.constant';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
//import { jwtConstants } from './constants';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(private readonly  authService: AuthService,
                private readonly  configService: ConfigService) {
        super({
            jwtFromRequest: /*(req) => {
                if (!req || !req.cookies) return null;
                return req.cookies['refresh_token'];
            }*/
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('refresh_token.secret'),
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: {sub: number, email: string }) {
        const refreshToken = req.headers.authorization;
        console.log(refreshToken);
        return this.authService.getUserIfRefreshTokenMatches(refreshToken, payload.sub);
    }
}