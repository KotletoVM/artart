import { Painting } from 'src/painting/entities/painting.entity';
import { Music } from 'src/music/entities/music.entity';
export declare class Person {
    id: number;
    fullname?: string;
    pseudonym?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    views: number;
    likes: number;
    socNetworks: {
        instagram: string;
        vk: string;
        site: string;
    };
    personPaintings?: Painting[];
    personMusic?: Music[];
}
