import { Module } from '@nestjs/common';
import { PaintingService } from './painting.service';
import { PaintingController } from './painting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Painting} from  './entities/painting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Painting])],
  controllers: [PaintingController],
  providers: [PaintingService],
  exports: [PaintingService]
})
export class PaintingModule {}
