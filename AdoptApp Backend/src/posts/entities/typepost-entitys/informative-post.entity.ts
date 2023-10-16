import { Entity, Column, OneToMany } from 'typeorm';
import { Post } from '../post.entity';
import { Comment } from '../../../comments/entities/comment.entity';

@Entity()
export class Informative extends Post {
  @Column()
  tipo: string;

  @OneToMany(
    () => Comment,
    (comment) => comment.informative
  )
  comments: Comment[];
}