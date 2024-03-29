import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository, Not  } from 'typeorm';
import { SearchPersonDto } from './dto/search-person.dto';
import { Art } from 'src/art/entities/art.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Request as Req} from 'express';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { v4 as uuid } from 'uuid';
import { FileService } from 'src/file/file.service';
import { SortDto } from './dto/sort.dto';

@Injectable()
export class PersonService {

  constructor(
      @InjectRepository(Person)
      private personRepository: Repository<Person>,
      @InjectRepository(Art)
      private artRepository: Repository<Art>,
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

  async updatePersonpic(personid: number, file: Express.Multer.File){
    if (personid){
      const person = await this.findOneSimple(personid)
          .catch(e => {throw new BadRequestException('Id must be specified as number')})
      if (person){
        const filename = `personpic/${uuid()}-${person.id}.png`;
        const newPersonpic = await this.fileService.saveFile(filename, file);
        if (!person.personpic.includes('personpic.png')){
          this.fileService.deleteFile(person.personpic);
        }
        await this.update(personid, {personpic: newPersonpic.Location});
        return {message: 'Person\'s userpic updated', url: newPersonpic.Location}
      }
      else {
        throw new NotFoundException('Person not found')
      }
    }
    else {
      throw new BadRequestException('Id must be specified')
    }
  }

  async setLike(userid: number, personid: number) {
    const qb = this.personRepository.createQueryBuilder('person');
    let person;
    try {person = await this.findOneSimple(personid);}
    catch {throw new BadRequestException('Person id must be number')}
    if (!person){
      throw new NotFoundException('person not found.');
    }
    try {
      await qb.relation(Person, "liked_by").of(personid).add(userid);
    }
    catch (e) {
      if (e.code === '23505'){
        const qb1 = this.personRepository.createQueryBuilder('person');
        qb.relation(Person, "liked_by").of(personid).remove(userid);
        const upd = await this.personRepository.update(personid, {likes: person.likes - 1});
        const pers = await this.findOneSimple(personid);
        return {likes: pers.likes, liked: false}
      }
      else return new Error('Error: ' + e.code)
    }
    const upd = await this.personRepository.update(personid, {likes: person.likes + 1});
    const pers = await this.findOneSimple(personid);
    return {likes: pers.likes, liked: true}
  }

  async findAll(req: Req, sortDto: SortDto) {
    const take = Number(sortDto.take)
    const skip = Number(sortDto.skip)
    let orderBy: string;
    switch (sortDto.orderBy) {
      case 'createDate':
        orderBy = "person.createdAt"
            break
      case 'alphabet':
        orderBy = "person.fullname"
            break
      case 'popular':
        orderBy = "person.likes"
    }
    const currentUserId = await this.isAuth(req);
    if (!currentUserId){
      const qb = this.personRepository.createQueryBuilder('person');
      const [persons, count] =await qb.leftJoinAndSelect("person.tags", "tag").take(take).skip(skip).orderBy(orderBy, sortDto.order).getManyAndCount();
      return {persons: persons, count: count};
    }
    const qb = this.personRepository.createQueryBuilder('person');
    const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["person","user.id","user.name"]).orderBy(orderBy, sortDto.order).take(take).skip(skip).getManyAndCount();
    const setLiked = await this.setLikedforCurrentUser(currentUserId, persons);
    return {persons: setLiked, count: count};
  }
/*
  async getPopular(req: Req, sortDto: SortDto) {
    const currentUserId = await this.isAuth(req);
    if (!currentUserId){
      const qb = this.personRepository.createQueryBuilder('person');
      const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").orderBy('person.likes', sortDto.order).take(sortDto.take).skip(sortDto.skip).getManyAndCount();
      return [persons, count];
    }
    const qb = this.personRepository.createQueryBuilder('person');
    const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["person","user.id","user.name"]).orderBy('person.likes', sortDto.order).take(sortDto.take).skip(sortDto.skip).getManyAndCount();
    return [this.setLikedforCurrentUser(currentUserId, persons), count];
  }

  async getByAlphabet(req: Req, sortDto: SortDto) {
    const currentUserId = await this.isAuth(req);
    if (!currentUserId){
      const qb = this.personRepository.createQueryBuilder('person');
      const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").orderBy('person.fullname', sortDto.order).take(sortDto.take).skip(sortDto.skip).getManyAndCount();
      return [persons, count];
    }
    const qb = this.personRepository.createQueryBuilder('person');
    const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["person","user.id","user.name"]).orderBy('person.fullname', sortDto.order).take(sortDto.take).skip(sortDto.skip).getManyAndCount();
    return [this.setLikedforCurrentUser(currentUserId, persons), count];
  }
*/
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
      return {persons, count};
    }
    const qb = this.personRepository.createQueryBuilder('person');
    const qb1 = this.personRepository.createQueryBuilder('person');
    const personsWTagsId = await qb.leftJoinAndSelect("person.tags", "tag").select(["person.id", "person.views"]).where(`tag.id = :tag`, {tag: tagid}).take(take).skip(skip).orderBy('person.views', 'DESC').getMany();
    const personids = [];
    personsWTagsId.forEach(function(pers){
      personids.push(pers.id);
    })
    const [persons, count] = await qb1.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["user.id", "user.name"]).where(`person.id IN (:...personid)`, {personid: personids}).orderBy('person.views', 'DESC').take(take).skip(skip).getManyAndCount();
    return {persons: this.setLikedforCurrentUser(currentUserId, persons), count};
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
    if (person) {
      this.personRepository.update(id, {views: person.views + 1});
      return this.setLikedforCurrentUser(currentUserId, [person])[0]
    }
    else throw new NotFoundException('Person not found.');
  }

  async getSoc(personid: number){
    const qb = this.personRepository.createQueryBuilder('person');
    const person = await qb.where("person.id = :id", {id: personid}).getOne();
    return person.socNetworks;
  }

  async findOneSimple(id: number){
    const qb = this.personRepository.createQueryBuilder('person');
    const person = await qb.where("person.id = :id", {id: id}).getOne();
    return person;
  }

  async findUsersFavorite(id: number, take: number = 10, skip: number = 0){
    const qb = this.personRepository.createQueryBuilder('person');
    const [persons, count] = await qb.leftJoinAndSelect("person.tags", "tag").leftJoin("person.liked_by", "user").addSelect(["user.id", "user.name"]).where(`user.id = :id`, {id: id}).take(take).skip(skip).orderBy('person.views', 'DESC').getManyAndCount();
    return {persons: this.setLikedforCurrentUser(id, persons), count};
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

    let [persons, count] = await qb.take(take).skip(skip).getManyAndCount();
    return {persons, count};

  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    this.personRepository.update(id, updatePersonDto);
    return {message: 'Person\'s information updated'}
  }

  async remove(id: number) {
    const qb = this.personRepository.createQueryBuilder('person');
    this.artRepository.delete({personid: id});
    this.personRepository.delete(id);
    return {message: 'Person deleted'}
  }

  setLikedforCurrentUser(currentUserId, persons: Person[] ){
    try {
      persons.forEach(person => {
        person.liked = false;
        person.liked_by.forEach(like => {
          if (like.id == currentUserId){
            person.liked = true;
          }
        })
      })
      return persons;
    }
    catch (e) {
      return null;
    }
  }

  async isAuth(req: Req){
    if (!req.headers.authorization)
      return false;
    const decodedJwt = await jwtDecode<JwtPayload>(req.headers.authorization);
    return Number(decodedJwt['sub']);
  }

  async updatePreview(id: number, url: string){
    await this.personRepository.update(id, {previewWork: url})
    return {message: 'Person\'s preview updated', url: url}
  }
}


