import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Adopt } from '../../posts/entities/typepost-entitys/adopt-post.entity';
import { Lost } from '../../posts/entities/typepost-entitys/lost-post.entity';
import { Informative } from '../../posts/entities/typepost-entitys/informative-post.entity';

@Entity()
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    reason: string;

    @Column('text')
    userId: string;

    @Column('text')
    postId: string; // ID del post reportado

    @Column('text')
    type: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date; // Hora en la cual se realizó el reporte

    // Relación con AdoptPost
    @ManyToOne(() => Adopt, adoptPost => adoptPost.reports, { nullable: true })
    adoptPost: Adopt;

    // Relación con LostPost
    @ManyToOne(() => Lost, lostPost => lostPost.reports, { nullable: true })
    lostPost: Lost;

    // Relación con InformativePost
    @ManyToOne(() => Informative, informativePost => informativePost.reports, { nullable: true })
    informativePost: Informative;
}