import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Comment} from  './entities/comment.entity';
import { Person } from 'src/person/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), TypeOrmModule.forFeature([Person])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
