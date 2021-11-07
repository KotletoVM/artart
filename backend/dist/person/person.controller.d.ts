import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { SearchPersonDto } from './dto/search-person.dto';
export declare class PersonController {
    private readonly personService;
    constructor(personService: PersonService);
    create(createPersonDto: CreatePersonDto): Promise<CreatePersonDto & import("./entities/person.entity").Person>;
    findAll(): Promise<import("./entities/person.entity").Person[]>;
    getPopular(): Promise<{
        persons: import("./entities/person.entity").Person[];
        number: number;
    }>;
    search(searchPersonDto: SearchPersonDto): Promise<{
        persons: import("./entities/person.entity").Person[];
        number: number;
    }>;
    findPainters(): Promise<import("./entities/person.entity").Person[]>;
    findMusicians(): Promise<import("./entities/person.entity").Person[]>;
    findOne(id: string): Promise<import("./entities/person.entity").Person>;
    update(id: string, updatePersonDto: UpdatePersonDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
