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
    const person = await this.personRepository.findOne(personid);
    if (!person) throw new NotFoundException('person not found')
    const comment = await this.commentRepository.save({
      text: createCommentDto.text,
      person: {id: personid},
      user: {id: userid}
    });
    this.personRepository.update(personid, {comments: person.comments + 1});
    return comment;
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
    //return this.commentRepository.find({where: {person: {id: personid}}});
    const qb = this.commentRepository.createQueryBuilder('comment');
    const [comments, number] = await qb.innerJoinAndSelect('comment.user', 'user').select('comment').addSelect('user.id')
        .addSelect('user.name').addSelect('user.userpic').where('comment.person.id = :personid', {personid: personid}).take(take).skip(skip).getManyAndCount();
    return [comments, number];
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
