import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm'
import {Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";
import { UserRole } from 'src/enums/role.enum';



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({unique: true})
    email: string;
    //@Column({nullable: true})
    //password: string;
    @Column({nullable: true})
    hash: string;
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole[]
    @Column({default: 'https://lowcars.net/wp-content/uploads/2017/02/userpic.png'})
    userpic: string;
}
