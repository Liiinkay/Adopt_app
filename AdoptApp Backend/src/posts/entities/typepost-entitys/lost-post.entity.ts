import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from '../post.entity';
import { Comment } from '../../../comments/entities/comment.entity';
import { Report } from 'src/reports/entities/report.entity';


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

  @OneToMany(
    () => Comment,
    (comment) => comment.lost
  )
  comments: Comment[];

  @OneToMany(() => Report, report => report.lostPost)
  reports: Report[];
}