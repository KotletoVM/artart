import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(req: any, createCommentDto: CreateCommentDto, personid: number): Promise<{
        text: string;
        person: {
            id: number;
        };
        user: {
            id: number;
        };
    } & import("./entities/comment.entity").Comment>;
    findAllforPerson(personid: number): Promise<(number | import("./entities/comment.entity").Comment[])[]>;
    findAll(): Promise<import("./entities/comment.entity").Comment[]>;
    findOne(id: string): Promise<import("./entities/comment.entity").Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, req: any): Promise<import("typeorm").UpdateResult>;
    remove(id: string, req: any): Promise<import("typeorm").DeleteResult>;
}
