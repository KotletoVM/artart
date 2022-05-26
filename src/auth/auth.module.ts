import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashedRefreshToken } from 'src/hashed-refresh-token/entities/hashed-refresh-token.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtRefreshTokenStrategy } from './strategies/jwtRefreshToken.strategy';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';
import { EmailConfirmationStrategy } from './strategies/emailConfirmation.strategy';
import {HttpModule} from "@nestjs/axios"
import { FileModule } from 'src/file/file.module';
import { RefreshSession } from './entities/refreshSession.entity';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({
    signOptions: { algorithm: 'RS256' },
  }),
    TypeOrmModule.forFeature([HashedRefreshToken]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([RefreshSession]),
    EmailConfirmationModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }), FileModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy, EmailConfirmationStrategy]
})
export class AuthModule {}
