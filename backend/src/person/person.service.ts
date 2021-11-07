import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository, Not  } from 'typeorm';
import { SearchPersonDto } from './dto/search-person.dto';
import { Music } from 'src/music/entities/music.entity';
import { Painting } from 'src/painting/entities/painting.entity';

@Injectable()
export class PersonService {

  constructor(
      @InjectRepository(Person)
      private personRepository: Repository<Person>,
      @InjectRepository(Painting)
      private paintingRepository: Repository<Painting>,
      @InjectRepository(Music)
      private musicRepository: Repository<Music>

  ) {}

  create(createPersonDto: CreatePersonDto) {
    return this.personRepository.save(createPersonDto);
  }

  findAll() {
    return this.personRepository.find({
      order: {
        createdAt: 'DESC'
      },

    });
  }

  async findPainters() {
    const qb = this.personRepository.createQueryBuilder('person');
    return qb.innerJoinAndSelect("person.personPaintings", "painting").getMany()
  }

  async findMusicians() {
    const qb = this.personRepository.createQueryBuilder('person');
    return qb.innerJoinAndSelect("person.personMusic", "music").getMany()
  }

  async findOne(id: number) {
    //const qb = this.personRepository.createQueryBuilder('person');
    //qb.innerJoinAndSelect("person.personPaintings", "painting").innerJoinAndSelect("person.personMusic", "music").where("person.id = :id", { id: id });
    //let onePerson = await qb.getOne();
    let onePerson = await this.personRepository.findOne(id, {relations: ["personPaintings", "personMusic"]});
    if(onePerson)this.personRepository.update(id, {views: onePerson.views + 1});
    return onePerson;
  }



  async getPopular() {
    const qb = this.personRepository.createQueryBuilder('popularQueryBuilder');
    qb.orderBy('views', 'DESC');
    qb.limit(10);
    let [persons, number] = await  qb.getManyAndCount();
    return {persons, number};
  }

  async search(searchPersonDto: SearchPersonDto) {
    const qb = this.personRepository.createQueryBuilder('searchQueryBuilder');

    if (searchPersonDto.views){qb.orderBy('views',searchPersonDto.views);}

    if (searchPersonDto.description){qb.andWhere(`searchQueryBuilder.description ILIKE :description`);}

    if (searchPersonDto.fullname){qb.andWhere(`searchQueryBuilder.fullname ILIKE :fullname`);}

    if (searchPersonDto.pseudonym){qb.andWhere(`searchQueryBuilder.pseudonym ILIKE :pseudonym`);}

    qb.setParameters({
      description: `%${searchPersonDto.description}%`,
      fullname:`%${searchPersonDto.fullname}%`,
      pseudonym:`%${searchPersonDto.pseudonym}%`
    })
    let [persons, number] = await  qb.getManyAndCount();
    return {persons, number};

  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return this.personRepository.update(id, updatePersonDto);
  }

  remove(id: number) {
    this.paintingRepository.delete({personid: id});
    this.musicRepository.delete({personid: id});
    return this.personRepository.delete(id);
  }

  async setLike(id: number) {
    let onePerson = await this.personRepository.findOne(id);
    this.personRepository.update(id, {views: onePerson.likes + 1});
  }
}
