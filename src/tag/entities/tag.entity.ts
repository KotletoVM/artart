import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Person } from 'src/person/entities/person.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @ManyToMany(() => Person, {nullable: true, eager: true, cascade: true})
    @JoinTable({
        name: "person_tags"
    })
    persons: Person[];
    //@ManyToMany(type => Person, person => person.id,
        /*{ eager: true, cascade: true}*///)
}