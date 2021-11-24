import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({
    secret: "test",
    signOptions: { expiresIn: '30m' },
  }), ConfigModule],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService]
})
export class ResetPasswordModule {}
