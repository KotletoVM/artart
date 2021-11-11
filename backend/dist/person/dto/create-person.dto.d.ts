import { Tag } from "src/tag/entities/tag.entity";
export declare class CreatePersonDto {
    id: number;
    fullname: string;
    pseudonym: string;
    description: string;
    personpic: string;
    tags: Tag[];
}
