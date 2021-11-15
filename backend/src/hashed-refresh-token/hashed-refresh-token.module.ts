import { Module } from '@nestjs/common';
import { HashedRefreshTokenService } from './hashed-refresh-token.service';
import { HashedRefreshTokenController } from './hashed-refresh-token.controller';

@Module({
  controllers: [HashedRefreshTokenController],
  providers: [HashedRefreshTokenService]
})
export class HashedRefreshTokenModule {}
