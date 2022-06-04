import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { Repository } from 'typeorm';
import { PersonService } from 'src/person/person.service';

@Injectable()
export class ArtService {
  constructor(
      @InjectRepository(Art)
      private artRepository: Repository<Art>,
      private personService: PersonService
  ) {}


  async create(createArtDto: CreateArtDto) {
    if (await this.personService.findOneSimple(createArtDto.personid)) {
      if (createArtDto.pic != null && createArtDto.previewChange && createArtDto.pic.length != 0){
        this.personService.updatePreview(createArtDto.personid, createArtDto.pic[0]);
      }
      return this.artRepository.save(createArtDto);
    }
    else throw new NotFoundException('Person not found')
  }

  findAllforPerson(personid: number) {
    return this.artRepository.find({where: {personid: personid}})
        .then(arts => {
          if (arts.length === 0) throw new NotFoundException('There is no art of specified person')
          else return {arts, count: arts.length}
        })
  }

  async findOne(id: number) {
    const qb = this.artRepository.createQueryBuilder('art');
    const art = await qb.innerJoinAndSelect('art.personid', 'person').select('art').addSelect('person.id').addSelect('person.fullname').where('art.id = :id', {id: id}).getOne();
    if (!art) throw new NotFoundException('Art with specified id not found')
    return art
  }

  async findOneSimple(id: number) {
    const qb = this.artRepository.createQueryBuilder('art');
    const art = await qb.select('art').where('art.id = :id', {id: id}).getOne();
    if (!art) throw new NotFoundException('Art with specified id not found')
    return art
  }

  async update(id: number, updateArtDto: UpdateArtDto) {
    await this.findOneSimple(id)
    this.artRepository.update(id, updateArtDto);
    return {message: 'Art updated'}
  }

  async remove(id: number) {
    await this.findOneSimple(id)
    this.artRepository.delete(id);
    return {message: 'Art deleted'}
  }
}
