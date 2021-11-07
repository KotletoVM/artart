import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Comment} from  './entities/comment.entity';

@Injectable()
export class CommentService {

  constructor(
      @InjectRepository(Comment)
      private commentRepository: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    return this.commentRepository.save({
      text: createCommentDto.text,
      person: {id: createCommentDto.personid},
      user: {id: 2}
    });
  }

  findAll() {
    return this.commentRepository.find();
  }

  findOne(id: number) {
    return this.commentRepository.findOne(id);
  }

  //доделать вывод юзера без лишних параметров (использовать QueryBuilder)
  findAllforPerson(personid: number){
    return this.commentRepository.find({where: {person: {id: personid}}});
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
