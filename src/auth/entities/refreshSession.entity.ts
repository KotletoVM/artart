import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn} from 'typeorm'
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
import { User } from 'src/user/entities/user.entity';

@Entity()
export class RefreshSession {
    @PrimaryColumn('uuid')
    id: number;
    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: 'userid'})
    userid: number;
    @Column()
    ua: string;
    @Column({nullable: true})
    fingerprint: string;
    @Column()
    ip: string;
    @Column()
    expiresin: number;
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
}