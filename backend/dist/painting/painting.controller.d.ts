import { PaintingService } from './painting.service';
import { CreatePaintingDto } from './dto/create-painting.dto';
import { UpdatePaintingDto } from './dto/update-painting.dto';
export declare class PaintingController {
    private readonly paintingService;
    constructor(paintingService: PaintingService);
    create(createPaintingDto: CreatePaintingDto): Promise<CreatePaintingDto & import("./entities/painting.entity").Painting>;
    findAllforPerson(personid: number): Promise<import("./entities/painting.entity").Painting[]>;
    findOne(id: string): Promise<import("./entities/painting.entity").Painting>;
    update(id: string, updatePaintingDto: UpdatePaintingDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
