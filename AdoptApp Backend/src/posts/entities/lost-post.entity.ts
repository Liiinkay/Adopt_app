import { Entity, Column } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Lost extends Post {
  @Column()
  tipo: string;

}