import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Person} from  './entities/person.entity';
import {Music} from  '../music/entities/music.entity';
import {Art} from  '../art/entities/art.entity';
import { MusicService } from 'src/music/music.service';
import { CommentService } from 'src/comment/comment.service';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Art]), TypeOrmModule.forFeature([Music]), TypeOrmModule.forFeature([Person]), CommentModule],
  controllers: [PersonController],
  providers: [PersonService]
})
export class PersonModule {}
