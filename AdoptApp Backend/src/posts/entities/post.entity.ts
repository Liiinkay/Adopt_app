import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToOne, OneToMany } from 'typeorm';
import {User} from 'src/users/entities/user.entity'
import { PostMultimedia } from './multimedia-post.entity';
import { Report } from 'src/reports/entities/report.entity';
import { PostLikes } from './post-like.entity';

@Entity()
export abstract class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    authorID: string

    @Column()
    type: string

    @OneToMany(
        () => PostMultimedia,
        postMultimedia => postMultimedia.post
    )
    multimedia: PostMultimedia

    @ManyToOne(
        () => User,
        user => user.post,
        {onDelete: 'CASCADE'}
    )
    author: User

    //@OneToMany(
    //    () => PostLikes, 
    //    postLikes => postLikes.post
    //)
    //postLikes: PostLikes[];

    @Column({ default: 0 })
    likesCount: number;
}
