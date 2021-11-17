import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from  './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { HashedRefreshToken } from 'src/hashed-refresh-token/entities/hashed-refresh-token.entity';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([HashedRefreshToken]), forwardRef(() => EmailConfirmationModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
