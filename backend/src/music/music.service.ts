import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Music } from './entities/music.entity';

@Injectable()
export class MusicService {

  constructor(
      @InjectRepository(Music)
      private musicRepository: Repository<Music>,
  ) {}


  create(createMusicDto: CreateMusicDto) {
    return this.musicRepository.save(createMusicDto);
  }

  findAllforPerson(personid: number) {
    return this.musicRepository.find({where: {personid: personid}})
  }

  findOne(id: number) {
    return this.musicRepository.findOne(id, {relations: ["person"]});
  }

  async update(id: number, updateMusicDto: UpdateMusicDto) {
    return this.musicRepository.update(id, updateMusicDto);
  }


  remove(id: number) {
    return this.musicRepository.delete(id);
  }
}
