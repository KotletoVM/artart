import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from  './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';
import { FileModule } from 'src/file/file.module';
import { ResetPasswordModule } from 'src/reset-password/reset-password.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    forwardRef(() => EmailConfirmationModule), FileModule, ResetPasswordModule, TokenModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
