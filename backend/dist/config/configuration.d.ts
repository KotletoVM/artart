import { User } from "src/user/entities/user.entity";
import { Person } from "src/person/entities/person.entity";
import { Tag } from "src/tag/entities/tag.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { HashedRefreshToken } from "src/hashed-refresh-token/entities/hashed-refresh-token.entity";
export declare const config: () => {
    database: {
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        entities: (typeof User | typeof Person | typeof Comment | typeof Tag | typeof HashedRefreshToken)[];
        synchronize: boolean;
    };
    access_token: {
        secret: string;
        expiresIn: string;
    };
    refresh_token: {
        secret: string;
        expiresIn: string;
    };
    verification: {
        secret: string;
        expiresIn: string;
        url: string;
    };
    email: {
        service: string;
        user: string;
        password: string;
    };
};
