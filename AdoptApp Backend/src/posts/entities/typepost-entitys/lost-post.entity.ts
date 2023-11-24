import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from '../post.entity';
import { Comment } from '../../../comments/entities/comment.entity';
import { Report } from 'src/reports/entities/report.entity';
import { PostLikes } from '../post-like.entity';
import { PostMultimedia } from '../multimedia-post.entity';


@Entity()
export class Lost extends Post {
  @Column()
  state: string;

  @Column()
  track_detail: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_change: Date;

  @Column()
  coordinates: string;

  @Column({ nullable: true })
  relevant_information: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @OneToMany(
    () => Comment,
    (comment) => comment.lost
  )
  comments: Comment[];

  @OneToMany(() => Report, report => report.lostPost, {cascade: true})
  reports: Report[];

  @OneToMany(() => PostLikes, postLikes => postLikes.lostPost, {cascade: true})
  postLikes: PostLikes[];

  @OneToMany(() => PostMultimedia, multimedia => multimedia.lostPost, {cascade: true})
  multimedia: PostMultimedia[];
}