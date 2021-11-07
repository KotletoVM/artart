import { CreatePaintingDto } from './dto/create-painting.dto';
import { UpdatePaintingDto } from './dto/update-painting.dto';
import { Painting } from './entities/painting.entity';
import { Repository } from 'typeorm';
export declare class PaintingService {
    private paintingRepository;
    constructor(paintingRepository: Repository<Painting>);
    create(createPaintingDto: CreatePaintingDto): Promise<CreatePaintingDto & Painting>;
    findAllforPerson(personid: number): Promise<Painting[]>;
    findOne(id: number): Promise<Painting>;
    update(id: number, updatePaintingDto: UpdatePaintingDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
