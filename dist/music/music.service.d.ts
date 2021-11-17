import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { Repository } from 'typeorm';
import { Music } from './entities/music.entity';
export declare class MusicService {
    private musicRepository;
    constructor(musicRepository: Repository<Music>);
    create(createMusicDto: CreateMusicDto): Promise<CreateMusicDto & Music>;
    findAllforPerson(personid: number): Promise<Music[]>;
    findOne(id: number): Promise<Music>;
    update(id: number, updateMusicDto: UpdateMusicDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
