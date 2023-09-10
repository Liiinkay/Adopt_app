import { Entity, Column } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Lost extends Post {
  @Column()
  state: string;

  @Column()
  track_detail: string;

  @Column()
  last_change: string;

  @Column()
  coordinates: string;

  @Column()
  coment: string;
}