import { Entity, Column } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Adopt extends Post {
  @Column()
  tipo: string;

}