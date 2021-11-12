import { User } from "src/user/entities/user.entity";
import { Person } from "src/person/entities/person.entity";
import { Art } from "src/art/entities/art.entity";
import { Music } from "src/music/entities/music.entity";
import { Tag } from "src/tag/entities/tag.entity";
import { Event } from "src/event/entities/event.entity";
import { Comment } from "src/comment/entities/comment.entity";

export const config = () => ({
    database: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Person, Comment, Art,Music, Event, Tag],
        synchronize: true
    }
});