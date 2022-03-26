import { Module, forwardRef } from '@nestjs/common';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Art} from  './entities/art.entity';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([Art]), PersonModule],
  controllers: [ArtController],
  providers: [ArtService],
  exports: [ArtService]
})
export class ArtModule {}
