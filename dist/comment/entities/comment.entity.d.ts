import { User } from 'src/user/entities/user.entity';
import { Person } from 'src/person/entities/person.entity';
export declare class Comment {
    id: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    person: Person;
}
