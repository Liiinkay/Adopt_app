import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Informative } from '../../posts/entities/typepost-entitys/informative-post.entity';
import { Lost } from '../../posts/entities/typepost-entitys/lost-post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  author: string;

  // Relación con la clase Informative (uno a muchos)
  @ManyToOne(
    () => Informative,
    (informative) => informative.comments,
    { cascade: true }
  )
  informative: Informative;

  // Relación con la clase Lost (uno a muchos)
  @ManyToOne(
    () => Lost,
    (lost) => lost.comments,
    { cascade: true }
  )
  lost: Lost;

  // Relación con respuestas (uno a muchos)
  @OneToMany(
    () => Comment,
    (reply) => reply.parentComment,
    { cascade: true }
  )
  replies: Comment[];

  // Relación con el comentario principal (muchos a uno)
  @ManyToOne(
    () => Comment,
    (parentComment) => parentComment.replies,
    { onDelete: 'CASCADE' })
  parentComment: Comment;
}