import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Person} from  './entities/person.entity';
import {Art} from  '../art/entities/art.entity';
import { CommentService } from 'src/comment/comment.service';
import { CommentModule } from 'src/comment/comment.module';
import { Comment } from 'src/comment/entities/comment.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Art]), TypeOrmModule.forFeature([Person]), TypeOrmModule.forFeature([Comment]), CommentModule, FileModule],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService]
})
export class PersonModule {}
