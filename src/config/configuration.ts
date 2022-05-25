import { User } from "src/user/entities/user.entity";
import { Person } from "src/person/entities/person.entity";
import { Art } from "src/art/entities/art.entity";
import { Tag } from "src/tag/entities/tag.entity";
import { Event } from "src/event/entities/event.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { HashedRefreshToken } from "src/hashed-refresh-token/entities/hashed-refresh-token.entity";
import { RefreshSession } from 'src/auth/entities/refreshSession.entity';

export const config = () => ({
    database: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Person, Comment, Art, Event, Tag, HashedRefreshToken, RefreshSession],
        synchronize: true,
        ssl: { rejectUnauthorized: false }
    },
    access_token: {
        privateKey: process.env.ACCESS_JWT_PRIVATE,
        publicKey: process.env.ACCESS_JWT_PUBLIC,
        expiresIn: process.env.ACCESS_JWT_EXPIRESIN
    },
    refresh_token:{
        privateKey: process.env.REFRESH_JWT_PRIVATE,
        publicKey: process.env.REFRESH_JWT_PUBLIC,
        expiresIn: process.env.REFRESH_JWT_EXPIRESIN
    },
    verification:{
        secret: process.env.VERIFICATION_JWT_SECRET,
        expiresIn: process.env.VERIFICATION_JWT_EXPIRESIN,
        url: process.env.EMAIL_CONFIRMATION_URL
    },
    password_reset: {
        secret: process.env.RESET_PASSWORD_JWT_SECRET,
        expiresIn: process.env.RESET_PASSWORD_JWT_EXPIRESIN,
        url: process.env.RESET_PASSWORD_URL
    },
    email:{
        service: process.env.EMAIL_SERVICE,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },
    cookie:{
        cookieDomain: process.env.COOKIE_DOMAIN
    },
    awsConfig:{
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        endpoint: process.env.AWS_ENDPOINT
    },
    userConstraints: {
        email: process.env.USER_EMAIL_CONSTRAINT,
        name: process.env.USER_NAME_CONSTRAINT
    }
});