import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HashedRefreshTokenService } from './hashed-refresh-token.service';
import { CreateHashedRefreshTokenDto } from './dto/create-hashed-refresh-token.dto';
import { UpdateHashedRefreshTokenDto } from './dto/update-hashed-refresh-token.dto';

@Controller('hashed-refresh-token')
export class HashedRefreshTokenController {
  constructor(private readonly hashedRefreshTokenService: HashedRefreshTokenService) {}
/*
  @Post()
  create(@Body() createHashedRefreshTokenDto: CreateHashedRefreshTokenDto) {
    return this.hashedRefreshTokenService.create(createHashedRefreshTokenDto);
  }

  @Get()
  findAll() {
    return this.hashedRefreshTokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hashedRefreshTokenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHashedRefreshTokenDto: UpdateHashedRefreshTokenDto) {
    return this.hashedRefreshTokenService.update(+id, updateHashedRefreshTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hashedRefreshTokenService.remove(+id);
  }*/
}
