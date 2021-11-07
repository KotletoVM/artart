import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm'
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
import { User } from 'src/user/entities/user.entity';
import { Person } from 'src/person/entities/person.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable: false})
    text: string;
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
    @ManyToOne(type => User , user => user.id, { eager: true, cascade: true, nullable: false})
    @JoinColumn({name: 'userid'})
    user: User;
    @ManyToOne(type => Person, {nullable: false})
    @JoinColumn({name: 'personid'})
    person: Person;


}
