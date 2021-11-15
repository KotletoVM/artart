import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class HashedRefreshToken {
    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: 'userid'})
    userid: number;
    @PrimaryColumn()
    token: string;
}
