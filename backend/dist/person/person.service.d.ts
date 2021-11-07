import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { SearchPersonDto } from './dto/search-person.dto';
import { Music } from 'src/music/entities/music.entity';
import { Painting } from 'src/painting/entities/painting.entity';
export declare class PersonService {
    private personRepository;
    private paintingRepository;
    private musicRepository;
    constructor(personRepository: Repository<Person>, paintingRepository: Repository<Painting>, musicRepository: Repository<Music>);
    create(createPersonDto: CreatePersonDto): Promise<CreatePersonDto & Person>;
    findAll(): Promise<Person[]>;
    findPainters(): Promise<Person[]>;
    findMusicians(): Promise<Person[]>;
    findOne(id: number): Promise<Person>;
    getPopular(): Promise<{
        persons: Person[];
        number: number;
    }>;
    search(searchPersonDto: SearchPersonDto): Promise<{
        persons: Person[];
        number: number;
    }>;
    update(id: number, updatePersonDto: UpdatePersonDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    setLike(id: number): Promise<void>;
}
