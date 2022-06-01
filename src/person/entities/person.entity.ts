import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable} from 'typeorm'
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
import { Art } from 'src/art/entities/art.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fullname?: string;
    @Column({nullable: true})
    pseudonym?: string;
    @Column({nullable: true})
    description?: string;
    @Column({default: 'https://storage.yandexcloud.net/artart/personpic/personpic.png'})
    personpic: string;
    @Column({default: 'https://storage.yandexcloud.net/artart/personpic/personpic.png'})
    previewWork: string;
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
    @Column({default: 0})
    views: number;
    @Column({default: 0})
    likes: number;
    //@Column({default: 0})
    //comments: number;
    @Column("jsonb", {nullable: true})
    socNetworks: {
        vk: string;
        tg: string;
        site: string;
        foundation: string;
        yandexMusic: string;
    };
    @OneToMany(type => Art, art => art.personid,
        /*{ eager: true, cascade: true}*/)
    personArt?: Art[];
    @ManyToMany(() => Tag, {nullable: true, eager: true, cascade: true})
    @JoinTable({
        name: "person_tags"
    })
    tags: Tag[];
    @ManyToMany(() => User, {nullable: true, eager: true, cascade: true})
    @JoinTable({
        name: "person_likes"
    })
    liked_by: User[];

    liked: boolean;
}
