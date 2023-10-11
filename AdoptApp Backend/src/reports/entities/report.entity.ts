import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    reason: string;

    @ManyToOne(
        () => Post,
        post => post.reports)
    post: Post;

    @Column()
    userId: string;

    @Column()
    postId: string; // ID del post reportado

    @Column()
    type: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date; // Hora en la cual se realizó el reporte
}