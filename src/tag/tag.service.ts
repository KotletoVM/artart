import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
      @InjectRepository(Tag)
      private tagRepository: Repository<Tag>,
  ) {}

  async findPersonTags(personid: number){
    const qb = await this.tagRepository.createQueryBuilder('tag');
    return qb.select('tag').leftJoin("tag.persons", "person").where("person.id = :personid", {personid: personid}).getMany();
  }
}
