import { Injectable } from '@nestjs/common';
import { CreatePaintingDto } from './dto/create-painting.dto';
import { UpdatePaintingDto } from './dto/update-painting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Painting } from './entities/painting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaintingService {

  constructor(
      @InjectRepository(Painting)
      private paintingRepository: Repository<Painting>,
  ) {}


  create(createPaintingDto: CreatePaintingDto) {
    return this.paintingRepository.save(createPaintingDto);
  }

  findAllforPerson(personid: number) {
    return this.paintingRepository.find({where: {personid: personid}})
  }

  findOne(id: number) {
    return this.paintingRepository.findOne(id, {relations: ["personid"]});
  }

  //ограничение на админа
  update(id: number, updatePaintingDto: UpdatePaintingDto) {
    return this.paintingRepository.update(id, updatePaintingDto);
  }

  //ограничение на админа
  remove(id: number) {
    return this.paintingRepository.delete(id);
  }

}
