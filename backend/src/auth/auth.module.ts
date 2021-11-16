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

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({
    secret: "test",
    signOptions: { expiresIn: '30m' },
  }), TypeOrmModule.forFeature([HashedRefreshToken]), TypeOrmModule.forFeature([User]), EmailConfirmationModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy, EmailConfirmationStrategy]
})
export class AuthModule {}
