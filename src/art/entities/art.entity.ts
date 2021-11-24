import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm'
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
import { Person } from 'src/person/entities/person.entity';

@Entity()
export class Art {
    @PrimaryGeneratedColumn()
    id: number;
    @Column("simple-array")
    url: string[];
    @Column({default: 'без названия'})
    title: string;
    @Column({nullable:true})
    description: string;
    @ManyToOne(() => Person, {nullable: false})
    @JoinColumn({name: 'personid'})
    personid: number;
}
