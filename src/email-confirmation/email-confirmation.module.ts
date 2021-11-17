import { Module, forwardRef } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, JwtModule.register({
    secret: "test",
    signOptions: { expiresIn: '30m' },
  }), forwardRef(() => UserModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
