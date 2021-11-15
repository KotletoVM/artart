import { Music } from 'src/music/entities/music.entity';
import { Art } from 'src/art/entities/art.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Person {
    id: number;
    fullname?: string;
    pseudonym?: string;
    description?: string;
    personpic: string;
    createdAt: Date;
    updatedAt: Date;
    views: number;
    likes: number;
    socNetworks: {
        instagram: string;
        vk: string;
        site: string;
    };
    personArt?: Art[];
    personMusic?: Music[];
    tags: Tag[];
    liked_by: User[];
    liked: boolean;
}
