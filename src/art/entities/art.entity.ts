import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm'
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
