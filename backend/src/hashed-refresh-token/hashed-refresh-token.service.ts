import { Injectable } from '@nestjs/common';
import { CreateHashedRefreshTokenDto } from './dto/create-hashed-refresh-token.dto';
import { UpdateHashedRefreshTokenDto } from './dto/update-hashed-refresh-token.dto';

@Injectable()
export class HashedRefreshTokenService {
  create(createHashedRefreshTokenDto: CreateHashedRefreshTokenDto) {
    return 'This action adds a new hashedRefreshToken';
  }

  findAll() {
    return `This action returns all hashedRefreshToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hashedRefreshToken`;
  }

  update(id: number, updateHashedRefreshTokenDto: UpdateHashedRefreshTokenDto) {
    return `This action updates a #${id} hashedRefreshToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashedRefreshToken`;
  }
}
