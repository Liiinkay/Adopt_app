import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class SavedPost {

    @PrimaryGeneratedColumn()
    id: string

    @Column('text')
    authorId: string;

    @Column('text')
    idPost: string;

    @ManyToOne(
        () => User,
        user => user.saved_post
    )
    author: User

}