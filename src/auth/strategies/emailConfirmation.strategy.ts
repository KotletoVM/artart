import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailConfirmationStrategy extends PassportStrategy(Strategy, 'email-confirm') {
    constructor(private readonly  userService: UserService, private configService: ConfigService) {
        super({
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('access_token.publicKey').replace(/\\n/gm, '\n'),
            algorithms: ['RS256']
        });
    }

    async validate(payload: {sub: number, email: string }) {
        const data = { id: payload.sub, email: payload.email };
        const user = await this.userService.findByCond(data);
        if (!user){
            throw new UnauthorizedException('Пользователь не найден');
        }
        if (user.isEmailConfirmed == false){
            throw new UnauthorizedException('Confirm your email first');
        }
        return user;
    }
}