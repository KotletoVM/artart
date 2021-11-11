import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagService {
    create(createTagDto: CreateTagDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTagDto: UpdateTagDto): string;
    remove(id: number): string;
}
