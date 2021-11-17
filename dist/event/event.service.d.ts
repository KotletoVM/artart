import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
export declare class EventService {
    private eventRepository;
    constructor(eventRepository: Repository<Event>);
    create(createEventDto: CreateEventDto): Promise<CreateEventDto & Event>;
    findAll(): Promise<(number | Event[])[]>;
    findOne(id: number): Promise<Event>;
    update(id: number, updateEventDto: UpdateEventDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
