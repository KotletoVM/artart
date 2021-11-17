import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailConfirmationStrategy extends PassportStrategy(Strategy, 'email-confirm') {
    constructor(private readonly  userService: UserService, private configService: ConfigService) {
        super({
            jwtFromRequest: (req) => {
                if (!req || !req.cookies) return null;
                return req.cookies['refresh_token'];
            }/*ExtractJwt.fromAuthHeaderAsBearerToken()*/,
            ignoreExpiration: true,
            secretOrKey: configService.get('refresh_token.secret'),
        });
    }

    async validate(payload: {sub: number, email: string }) {
        const data = { id: payload.sub, email: payload.email };
        const user = await this.userService.findByCond(data);

        if (!user){
            throw new UnauthorizedException('User not found');
        }
        if (user.isEmailConfirmed == false){
            throw new UnauthorizedException('Confirm your email first');
        }
        return user;
    }
}