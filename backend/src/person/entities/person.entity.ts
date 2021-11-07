import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from 'typeorm'
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
import { Painting } from 'src/painting/entities/painting.entity';
import { Music } from 'src/music/entities/music.entity';



@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable: true})
    fullname?: string;
    @Column({nullable: true})
    pseudonym?: string;
    @Column({nullable: true})
    description?: string;
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
    @Column({default: 0})
    views: number;
    @Column({default: 0})
    likes: number;
    @Column("simple-json", {nullable: true})
    socNetworks: {instagram: string, vk: string, site: string};
    @OneToMany(type => Painting, painting => painting.personid,
        /*{ eager: true, cascade: true}*/)
    personPaintings?: Painting[]
    @OneToMany(type => Music, music => music.personid,
        /*{ eager: true, cascade: true}*/)
    personMusic?: Music[]
}
