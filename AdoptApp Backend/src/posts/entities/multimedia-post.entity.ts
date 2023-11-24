import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Adopt } from './typepost-entitys/adopt-post.entity';
import { Informative } from './typepost-entitys/informative-post.entity';
import { Lost } from './typepost-entitys/lost-post.entity';


@Entity()
export class PostMultimedia {
    
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column('text')
    url: string

    @ManyToOne(() => Adopt, adopt => adopt.multimedia, { nullable: true, onDelete: 'CASCADE'})
    adoptPost: Adopt;

    @ManyToOne(() => Informative, informative => informative.multimedia, { nullable: true, onDelete: 'CASCADE'})
    informativePost: Informative;

    @ManyToOne(() => Lost, lost => lost.multimedia, { nullable: true, onDelete: 'CASCADE'})
    lostPost: Lost;
}