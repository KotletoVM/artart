import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable} from 'typeorm'
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
import { Music } from 'src/music/entities/music.entity';
import { Art } from 'src/art/entities/art.entity';
import { Tag } from 'src/tag/entities/tag.entity';

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
    @Column({default: 'https://cdn4.vectorstock.com/i/1000x1000/84/68/hipster-man-in-glasses-avatar-profile-userpic-vector-8988468.jpg'})
    personpic: string;
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
    @OneToMany(type => Art, art => art.personid,
        /*{ eager: true, cascade: true}*/)
    personArt?: Art[];
    @OneToMany(type => Music, music => music.personid,
        /*{ eager: true, cascade: true}*/)
    personMusic?: Music[];
    @ManyToMany(() => Tag, {nullable: true, eager: true, cascade: true})
    @JoinTable({
        name: "person_tags"
    })
    tags: Tag[];
}
