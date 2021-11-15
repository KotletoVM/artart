import { Test, TestingModule } from '@nestjs/testing';
import { HashedRefreshTokenService } from './hashed-refresh-token.service';

describe('HashedRefreshTokenService', () => {
  let service: HashedRefreshTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashedRefreshTokenService],
    }).compile();

    service = module.get<HashedRefreshTokenService>(HashedRefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
