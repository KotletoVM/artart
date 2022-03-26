import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(take: number = 10, skip: number = 0) {
    const qb = this.eventRepository.createQueryBuilder('event');
    const [events, count] =await qb.take(take).skip(skip).getManyAndCount();
    return {events, count};
  }

  async findOne(id: number) {
    return this.findOneSimple(id)
  }

  async findOneSimple(id: number) {
    const event = await this.eventRepository.findOne(id);
    if (!event) throw new NotFoundException('Event not found')
    return event
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    await this.findOneSimple(id)
    await this.eventRepository.update(id, updateEventDto);
    return {message: 'Event updated'}
  }

  async remove(id: number) {
    await this.findOneSimple(id)
    await this.eventRepository.delete(id);
    return {message: 'Event deleted'}
  }
}
