import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './jwt.service';

@Module({
    imports: [JwtModule.register({
        signOptions: { algorithm: 'RS256' },
    })],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule {}