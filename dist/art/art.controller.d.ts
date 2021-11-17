import { ArtService } from './art.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
export declare class ArtController {
    private readonly artService;
    constructor(artService: ArtService);
    create(createArtDto: CreateArtDto): Promise<CreateArtDto & import("./entities/art.entity").Art>;
    findAllforPerson(personid: number): Promise<import("./entities/art.entity").Art[]>;
    findOne(id: string): Promise<import("./entities/art.entity").Art>;
    update(id: string, updateArtDto: UpdateArtDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
