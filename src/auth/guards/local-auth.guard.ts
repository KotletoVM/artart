import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    handleRequest(err, user) {
        if (err) {
            throw err || new UnauthorizedException('Необходимо заполнить все поля');
        }
        return user;
    }
}