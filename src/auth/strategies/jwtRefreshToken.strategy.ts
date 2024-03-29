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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('refresh_token.publicKey').replace(/\\n/gm, '\n'),
            algorithms: ['RS256'],
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: {sub: number, email: string, sessionid: string, exp: number}) {
        const refreshToken = req.headers.authorization;
        return {id: payload.sub, email: payload.email, sessionid: payload.sessionid, exp: payload.exp}
    }
}