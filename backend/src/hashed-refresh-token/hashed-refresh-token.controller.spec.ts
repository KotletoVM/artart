import { Test, TestingModule } from '@nestjs/testing';
import { HashedRefreshTokenController } from './hashed-refresh-token.controller';
import { HashedRefreshTokenService } from './hashed-refresh-token.service';

describe('HashedRefreshTokenController', () => {
  let controller: HashedRefreshTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HashedRefreshTokenController],
      providers: [HashedRefreshTokenService],
    }).compile();

    controller = module.get<HashedRefreshTokenController>(HashedRefreshTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
