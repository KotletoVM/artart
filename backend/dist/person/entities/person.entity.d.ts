import { Music } from 'src/music/entities/music.entity';
import { Art } from 'src/art/entities/art.entity';
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
}
