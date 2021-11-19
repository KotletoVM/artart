import { User } from "src/user/entities/user.entity";
import { Person } from "src/person/entities/person.entity";
import { Art } from "src/art/entities/art.entity";
import { Music } from "src/music/entities/music.entity";
import { Tag } from "src/tag/entities/tag.entity";
import { Event } from "src/event/entities/event.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { HashedRefreshToken } from "src/hashed-refresh-token/entities/hashed-refresh-token.entity";

export const config = () => ({
    database: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Person, Comment, Art,Music, Event, Tag, HashedRefreshToken],
        synchronize: true, //true,
        //ssl: { rejectUnauthorized: false }
    },
    access_token: {
        secret: process.env.ACCESS_JWT_SECRET,
        expiresIn: process.env.ACCESS_JWT_EXPIRESIN
    },
    refresh_token:{
        secret: process.env.REFRESH_JWT_SECRET,
        expiresIn: process.env.REFRESH_JWT_EXPIRESIN
    },
    verification:{
        secret: process.env.VERIFICATION_JWT_SECRET,
        expiresIn: process.env.VERIFICATION_JWT_EXPIRESIN,
        url: process.env.EMAIL_CONFIRMATION_URL
    },
    email:{
        service: process.env.EMAIL_SERVICE,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    }
});