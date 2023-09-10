import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Follows {

    @PrimaryGeneratedColumn()
    id: string

    @Column('text')
    authorId: string;

    @Column('text')
    followId: string;

    @ManyToOne(
        () => User,
        user => user.follows
    )
    author: User

}