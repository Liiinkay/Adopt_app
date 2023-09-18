import { Entity, Column } from 'typeorm';
import { Post } from '../post.entity';

@Entity()
export class Informative extends Post {
  @Column()
  tipo: string;

}