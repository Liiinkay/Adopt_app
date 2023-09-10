import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from './post.entity';


@Entity()
export class PostMultimedia {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    url: string

    @ManyToOne(
        () => Post,
        post => post.multimedia
    )
    post: Post
}