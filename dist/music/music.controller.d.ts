import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
export declare class MusicController {
    private readonly musicService;
    constructor(musicService: MusicService);
    create(createMusicDto: CreateMusicDto): Promise<CreateMusicDto & import("./entities/music.entity").Music>;
    findAllforPerson(personid: number): Promise<import("./entities/music.entity").Music[]>;
    findOne(id: string): Promise<import("./entities/music.entity").Music>;
    update(id: string, updateMusicDto: UpdateMusicDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
