import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
@Injectable()
export class EventService {

  constructor(
      @InjectRepository(Event)
      private eventRepository: Repository<Event>
  ) {}

  create(createEventDto: CreateEventDto) {
    return this.eventRepository.save(createEventDto);
  }

  async findAll() {
    const qb = this.eventRepository.createQueryBuilder('event');
    const [events, count] =await qb.take(3).orderBy("event.startDate", "ASC").getManyAndCount();
    return [events, count];
  }

  findOne(id: number) {
    return this.eventRepository.findOne();
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.eventRepository.update(id, updateEventDto);
  }

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}