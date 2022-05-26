import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly  userService: UserService, private configService: ConfigService, private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('access_token.publicKey').replace(/\\n/gm, '\n'),
            algorithms: ['RS256']
        });
    }

    async validate(payload: { sub: number, email: string, sessionid: uuid }) {
        const data = {id: payload.sub, email: payload.email};
        const user = await this.userService.findByCond(data);
        if (!user){
            throw new UnauthorizedException('User not found');
        }
        const session = await this.authService.findSession(payload.sessionid);
        if (!session){
            throw new UnauthorizedException('Session not found. Login again');
        }
        user.hash = null;
        return user;
    }
}