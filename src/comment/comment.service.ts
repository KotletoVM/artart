import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Comment} from  './entities/comment.entity';
import { Person } from 'src/person/entities/person.entity';

@Injectable()
export class CommentService {

  constructor(
      @InjectRepository(Comment)
      private commentRepository: Repository<Comment>,
      @InjectRepository(Person)
      private personRepository: Repository<Person>
  ) {}

  async create(createCommentDto: CreateCommentDto, userid: number, personid: number) {
    const person = await this.personRepository.findOne(personid, {loadEagerRelations: false});
    if (!person) throw new NotFoundException('Person not found')
    const comment = await this.commentRepository.save({
      text: createCommentDto.text,
      person: {id: personid},
      user: {id: userid}
    });
    this.personRepository.update(personid, {comments: person.comments + 1});
    return {message: 'Comment created', text: createCommentDto.text};
  }

  findAll(take: number = 10, skip: number = 0) {
    return this.commentRepository.find({
      take: take,
      skip: skip
    });
  }

  findOne(id: number) {
    const qb = this.commentRepository.createQueryBuilder('comment');
    const comment = qb.innerJoinAndSelect('comment.user', 'user').select('comment').addSelect('user.id').addSelect('user.name')
        .addSelect('user.userpic').where('comment.id = :id', {id: id}).getOne();
    return comment;
  }

  async findAllforPerson(personid: number, take: number = 10, skip: number = 0){
    const qb = this.commentRepository.createQueryBuilder('comment');
    const [comments, count] = await qb.innerJoinAndSelect('comment.user', 'user').select('comment').addSelect('user.id')
        .addSelect('user.name').addSelect('user.userpic').where('comment.person.id = :personid', {personid: personid}).take(take).skip(skip).getManyAndCount();
    if (count !== 0) return {comments, count}
    else throw new NotFoundException('Comments not found')
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.commentRepository.update(id, updateCommentDto);
    return {message: 'Comment updated', text: updateCommentDto.text}
  }

  async remove(id: number) {
    await this.commentRepository.delete(id);
    return {message: 'Comment deleted'}
  }
}
