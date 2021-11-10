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

  create(createCommentDto: CreateCommentDto, userid: number) {
    return this.commentRepository.save({
      text: createCommentDto.text,
      person: {id: createCommentDto.personid},
      user: {id: userid}
    });
  }

  findAll() {
    return this.commentRepository.find();
  }

  findOne(id: number) {
    //return this.commentRepository.findOne(id);
    const qb = this.commentRepository.createQueryBuilder('comment');
    const comment = qb.innerJoinAndSelect('comment.user', 'user').select('comment').addSelect('user.id').addSelect('user.name').addSelect('user.userpic').where('comment.id = :id', {id: id}).getOne();
    return comment;
  }

  //✔ - доделать вывод юзера без лишних параметров (использовать QueryBuilder)
  findAllforPerson(personid: number){
    //return this.commentRepository.find({where: {person: {id: personid}}});
    const qb = this.commentRepository.createQueryBuilder('comment');
    const comments = qb.innerJoinAndSelect('comment.user', 'user').select('comment').addSelect('user.id').addSelect('user.name').addSelect('user.userpic').where('comment.person.id = :personid', {personid: personid}).getMany();
    return comments;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
