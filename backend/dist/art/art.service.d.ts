import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { Art } from './entities/art.entity';
import { Repository } from 'typeorm';
export declare class ArtService {
    private artRepository;
    constructor(artRepository: Repository<Art>);
    create(createArtDto: CreateArtDto): Promise<CreateArtDto & Art>;
    findAllforPerson(personid: number): Promise<Art[]>;
    findOne(id: number): Promise<Art>;
    update(id: number, updateArtDto: UpdateArtDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
