import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from 'src/users/entities/user.entity';


@Entity()
export class SavedPost {

    @PrimaryGeneratedColumn('uuid')
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