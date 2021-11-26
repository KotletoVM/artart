import { Injectable } from '@nestjs/common';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtService {
  constructor(
      @InjectRepository(Art)
      private artRepository: Repository<Art>,
  ) {}


  create(createArtDto: CreateArtDto) {
    if (createArtDto.pic != null && createArtDto.previewChange && createArtDto.pic.length != 0){
      //this.personService.updatePreview(createArtDto.pic[0]);
    }
    return this.artRepository.save(createArtDto);
  }

  findAllforPerson(personid: number) {
    return this.artRepository.find({where: {personid: personid}})
  }

  findOne(id: number) {
    //return this.artRepository.findOne(id, {relations: ["personid"]});
    const qb = this.artRepository.createQueryBuilder('art');
    const art = qb.innerJoinAndSelect('art.personid', 'person').select('art').addSelect('person.id').addSelect('person.fullname').where('art.id = :id', {id: id}).getOne();
    return art;
  }

  update(id: number, updateArtDto: UpdateArtDto) {
    return this.artRepository.update(id, updateArtDto);
  }

  remove(id: number) {
    return this.artRepository.delete(id);
  }
}
