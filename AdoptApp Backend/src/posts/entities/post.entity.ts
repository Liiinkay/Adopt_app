import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import {User} from 'src/users/entities/user.entity'


@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    tittle: string

    @Column()
    description: string

    @Column()
    authorID: string

    @Column()
    type: string

    @Column('text',{
        array: true,
        default: []
    })
    multimedia: string[]
    
    @ManyToMany(
        () => User,
        user => user.post
    )
    author: User
}
