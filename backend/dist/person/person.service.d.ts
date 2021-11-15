import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { SearchPersonDto } from './dto/search-person.dto';
import { Music } from 'src/music/entities/music.entity';
import { Art } from 'src/art/entities/art.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Request as Req } from 'express';
import { CommentService } from '../comment/comment.service';
export declare class PersonService {
    private personRepository;
    private artRepository;
    private musicRepository;
    private readonly commentService;
    constructor(personRepository: Repository<Person>, artRepository: Repository<Art>, musicRepository: Repository<Music>, commentService: CommentService);
    create(createPersonDto: CreatePersonDto): Promise<{
        generatedMaps: import("typeorm").ObjectLiteral[];
    }>;
    findAll(req: Req): Promise<(number | Person[])[]>;
    getPopular(req: Req): Promise<(number | Person[])[]>;
    findByTag(req: Req, tagid: number): Promise<(number | Person[])[]>;
    findOne(req: Req, id: number): Promise<Person | {
        person: Person;
        comments: (number | Comment[])[];
    }>;
    findOneSimple(id: number): Promise<Person>;
    search(searchPersonDto: SearchPersonDto): Promise<{
        persons: Person[];
        number: number;
    }>;
    update(id: number, updatePersonDto: UpdatePersonDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    setLike(id: number): Promise<void>;
    findMusicians(): Promise<Person[]>;
    findArtists(): Promise<Person[]>;
    setLikedforCurrentUser(currentUserId: any, persons: Person[]): Person[];
    isAuth(req: Req): Promise<number | false>;
}
