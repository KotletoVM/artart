import { Module } from '@nestjs/common';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Art} from  './entities/art.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Art])],
  controllers: [ArtController],
  providers: [ArtService],
  exports: [ArtService]
})
export class ArtModule {}
