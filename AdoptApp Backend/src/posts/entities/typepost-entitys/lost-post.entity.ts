import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '../post.entity';

@Entity()
export class Lost extends Post {
  @Column()
  state: string;

  @Column()
  track_detail: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_change: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column()
  coordinates: string;

  @Column('text',{
    array: true,
    default: []
  })
  comment: string[];
}