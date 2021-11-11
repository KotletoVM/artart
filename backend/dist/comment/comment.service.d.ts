import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
export declare class CommentService {
    private commentRepository;
    constructor(commentRepository: Repository<Comment>);
    create(createCommentDto: CreateCommentDto, userid: number): Promise<{
        text: string;
        person: {
            id: number;
        };
        user: {
            id: number;
        };
    } & Comment>;
    findAll(): Promise<Comment[]>;
    findOne(id: number): Promise<Comment>;
    findAllforPerson(personid: number): Promise<(number | Comment[])[]>;
    update(id: number, updateCommentDto: UpdateCommentDto): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
