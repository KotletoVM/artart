import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository, Not  } from 'typeorm';
import { SearchPersonDto } from './dto/search-person.dto';
import { Art } from 'src/art/entities/art.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Request as Req} from 'express';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { v4 as uuid } from 'uuid';
import { FileService } from 'src/file/file.service';

@Injectable()
export class PersonService {

  constructor(
      @InjectRepository(Person)
      private personRepository: Repository<Person>,
      @InjectRepository(Art)
      private artRepository: Repository<Art>,
      @InjectRepository(Comment)
      private commentRepository: Repository<Comment>,
      private fileService: FileService
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    const qb = this.personRepository.createQueryBuilder('person');
    const person = await this.personRepository.save(createPersonDto);
    const tags = await qb.relation(Person, "tags").of(person.id).add(createPersonDto.tags);
    /*if(personpic){
      const filename = `personpic/${uuid()}-${person.id}.png`;
      const personpicUpload = await this.savePersonpic(filename, person.id, personpic);
    }*/
    return {person, tags};
  }

  async updatePersonpic(personid: number, file:  Express.Multer.File){
    const person = await this.personRepository.findOne({id: personid});
    const filename = `personpic/${uuid()}-${person.id}.png`;
    const newPersonpic = await this.fileService.saveFile(filename, file);
    if (!person.personpic.includes('personpic.png')){
      this.fileService.deleteFile(person.personpic);
    }
    return this.update(personid, {personpic: newPersonpic.Location});
  }

  async setLike(userid: number, personid: number) {
    const qb = this.personRepository.createQueryBuilder('person');
    let person = await this.personRepository.findOne(personid);
    if (!person){
      throw new NotFoundException('person not found.');
    }
    try {
      const liked = await qb.relation(Person, "liked_by").of(personid).add(userid);
    }
    catch (e) {
      throw new ForbiddenException('user can set only one like per person.');
    }
    return this.personRepository.update(personid, {views: person.views + 1 ,likes: person.likes + 1});;
  }

  async findAll(req: Req, take: number = 10, skip: number = 0) {
    const currentUserId = await this.isAuth(req);
    if (!currentUserId){
      const qb = this.personRepository.createQueryBuilder('person');
      const [persons, count] =await qb.leftJoinAndSelect("person.tags", "tag").take(take).skip(skip).orderBy("person.createdAt", "DESC").getManyAndCount();
      return [persons, count];
    }
    const qb = this.personRepository.createQueryBuilder('person');
    const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["person","user.id","user.name"]).orderBy("person.createdAt", "DESC").take(take).skip(skip).getManyAndCount();
    return [this.setLikedforCurrentUser(currentUserId, persons), count];
  }

  async getPopular(req: Req, take: number = 10, skip: number = 0) {
    const currentUserId = await this.isAuth(req);
    if (!currentUserId){
      const qb = this.personRepository.createQueryBuilder('person');
      const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").orderBy('person.views', 'ASC').take(take).skip(skip).getManyAndCount();
      return [persons, count];
    }
    const qb = this.personRepository.createQueryBuilder('person');
    const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["person","user.id","user.name"]).orderBy('person.views', 'DESC').take(take).skip(skip).getManyAndCount();
    return [this.setLikedforCurrentUser(currentUserId, persons), count];
  }

  async findByTag(req: Req, tagid: number, take: number = 10, skip: number = 0) {
    const currentUserId = await this.isAuth(req);
    if (!currentUserId){
      const qb = this.personRepository.createQueryBuilder('person');
      const qb1 = this.personRepository.createQueryBuilder('person');

      const personsWTagsId = await qb.leftJoinAndSelect("person.tags", "tag").select(["person.id", "person.views"]).where(`tag.id = :tag`, {tag: tagid}).take(take).skip(skip).orderBy('person.views', 'DESC').getMany();
      const personids = [];
      personsWTagsId.forEach(function(pers){
        personids.push(pers.id);
      })
      const [persons, count] = await qb1.leftJoinAndSelect("person.tags", "tag").where(`person.id IN (:...personid)`, {personid: personids}).orderBy('person.views', 'DESC').take(take).skip(skip).getManyAndCount();
      return [persons, count];
    }
    const qb = this.personRepository.createQueryBuilder('person');
    const qb1 = this.personRepository.createQueryBuilder('person');
    const personsWTagsId = await qb.leftJoinAndSelect("person.tags", "tag").select(["person.id", "person.views"]).where(`tag.id = :tag`, {tag: tagid}).take(take).skip(skip).orderBy('person.views', 'DESC').getMany();
    const personids = [];
    personsWTagsId.forEach(function(pers){
      personids.push(pers.id);
    })
    const [persons, count] = await qb1.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["user.id", "user.name"]).where(`person.id IN (:...personid)`, {personid: personids}).orderBy('person.views', 'DESC').take(take).skip(skip).getManyAndCount();
    return [this.setLikedforCurrentUser(currentUserId, persons), count];
  }

  async findOne(req: Req, id: number) {
    const currentUserId = await this.isAuth(req);
    if (!currentUserId){
      const qb = this.personRepository.createQueryBuilder('person');
      const person = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.personArt", "art").where("person.id = :id", {id: id}).getOne();
      return person;
    }
    const qb = this.personRepository.createQueryBuilder('person');
    const person = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").leftJoin("person.personArt", "art").addSelect(["user.id", "user.name"]).where("person.id = :id", {id: id}).getOne();
    this.personRepository.update(id, {views: person.views + 1});
    return this.setLikedforCurrentUser(currentUserId, [person]);
  }

  async findOneSimple(id: number){
    return this.personRepository.findOne(id);
  }

  async findUsersFavorite(id: number, take: number = 10, skip: number = 0){
    const qb = this.personRepository.createQueryBuilder('person');
    const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["user.id", "user.name"]).where(`user.id = :id`, {id: id}).take(take).skip(skip).orderBy('person.views', 'DESC').getManyAndCount();
    return [this.setLikedforCurrentUser(id, persons), count];
  }

  async search(searchPersonDto: SearchPersonDto, take: number = 10, skip: number = 0) {
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
    let [persons, number] = await  qb.take(take).skip(skip).getManyAndCount();
    return {persons, number};

  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return this.personRepository.update(id, updatePersonDto);
  }

  async remove(id: number) {
    const qb = this.personRepository.createQueryBuilder('person');
    this.artRepository.delete({personid: id});
    this.commentRepository.delete({person: {id: id}});
    return this.personRepository.delete(id);
  }

  setLikedforCurrentUser(currentUserId, persons: Person[] ){
    try {
      persons.forEach(person => {
        person.liked_by.forEach(like => {
          if (like.id == currentUserId){
            person.liked = true;
            return;
          }

        })
      })
      return persons;
    }
    catch (e) {
      throw new NotFoundException('persons not found.');
    }
  }

  async isAuth(req: Req){
    if (!req.cookies['access_token'])
      return false;
    const decodedJwt = await jwtDecode<JwtPayload>(req.cookies['access_token']);
    return Number(decodedJwt['sub']);
  }
}
