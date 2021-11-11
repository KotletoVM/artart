import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    create(createTagDto: CreateTagDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTagDto: UpdateTagDto): string;
    remove(id: string): string;
}
