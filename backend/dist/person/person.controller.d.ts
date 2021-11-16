import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { SearchPersonDto } from './dto/search-person.dto';
import { Request as Req } from 'express';
export declare class PersonController {
    private readonly personService;
    constructor(personService: PersonService);
    create(createPersonDto: CreatePersonDto): Promise<{
        generatedMaps: import("typeorm").ObjectLiteral[];
    }>;
    setLike(req: any, personid: number): Promise<import("typeorm").UpdateResult>;
    findAll(req: Req): Promise<(number | import("./entities/person.entity").Person[])[]>;
    getPopular(req: Req): Promise<(number | import("./entities/person.entity").Person[])[]>;
    search(searchPersonDto: SearchPersonDto): Promise<{
        persons: import("./entities/person.entity").Person[];
        number: number;
    }>;
    findByTag(tagid: number, req: Req): Promise<(number | import("./entities/person.entity").Person[])[]>;
    findUsersFavorite(req: any): Promise<(number | import("./entities/person.entity").Person[])[]>;
    findArtists(): Promise<import("./entities/person.entity").Person[]>;
    findMusicians(): Promise<import("./entities/person.entity").Person[]>;
    findOne(id: string, req: Req): Promise<import("./entities/person.entity").Person>;
    update(id: string, updatePersonDto: UpdatePersonDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
