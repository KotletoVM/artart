import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Person} from  './entities/person.entity';
import {Music} from  '../music/entities/music.entity';
import {Painting} from  '../painting/entities/painting.entity';
import { PaintingService } from 'src/painting/painting.service';
import { MusicService } from 'src/music/music.service';

@Module({
  imports: [TypeOrmModule.forFeature([Painting]), TypeOrmModule.forFeature([Music]), TypeOrmModule.forFeature([Person])],
  controllers: [PersonController],
  providers: [PersonService]
})
export class PersonModule {}
