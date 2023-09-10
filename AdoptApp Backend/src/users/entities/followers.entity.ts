import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Followers {

    @PrimaryGeneratedColumn()
    id: string

    @Column('text')
    authorId: string;

    @Column('text')
    followerId: string;

    @ManyToOne(
        () => User,
        user => user.followers
    )
    author: User

}