import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { Adopt } from './typepost-entitys/adopt-post.entity';
import { Informative } from './typepost-entitys/informative-post.entity';
import { Lost } from './typepost-entitys/lost-post.entity';


@Entity()
export class PostMultimedia {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    url: string

    @ManyToOne(() => Adopt, adopt => adopt.multimedia, { nullable: true })
    adoptPost: Adopt;

    @ManyToOne(() => Informative, informative => informative.multimedia, { nullable: true })
    informativePost: Informative;

    @ManyToOne(() => Lost, lost => lost.multimedia, { nullable: true })
    lostPost: Lost;
}