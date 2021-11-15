import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { jwtSecret } from '../constants/jwt-secret.constant';
//import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly  userService: UserService) {
        super({
            jwtFromRequest: (req) => {
                if (!req || !req.cookies) return null;
                return req.cookies['access_token'];
            }/*ExtractJwt.fromAuthHeaderAsBearerToken()*/,
            ignoreExpiration: false,
            secretOrKey: jwtSecret.secret,
        });
    }

    async validate(payload: {sub: number, email: string }) {
        const data = { id: payload.sub, email: payload.email };
        const user = await this.userService.findByCond(data);

        if (!user){
            throw new UnauthorizedException('User not found');
        }
        return data;
    }
}