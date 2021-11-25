import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm'
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
import { Person } from 'src/person/entities/person.entity';

@Entity()
export class Art {
    @PrimaryGeneratedColumn()
    id: number;
    @Column("simple-array", {nullable:true})
    pic: string[];
    @Column("simple-array", {nullable:true})
    video: string[];
    @Column({default: 'Без названия'})
    title: string;
    @Column({nullable:true})
    description: string;
    @ManyToOne(() => Person, {nullable: false})
    @JoinColumn({name: 'personid'})
    personid: number;
}
