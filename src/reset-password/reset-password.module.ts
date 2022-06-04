import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({
    secret: "test",
    signOptions: { expiresIn: '30m' },
  }), ConfigModule],
  controllers: [],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService]
})
export class ResetPasswordModule {}
