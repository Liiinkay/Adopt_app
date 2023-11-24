import { Entity, Column, OneToMany } from 'typeorm';
import { Post } from '../post.entity';
import { Comment } from '../../../comments/entities/comment.entity';
import { Report } from 'src/reports/entities/report.entity';
import { PostLikes } from '../post-like.entity';
import { PostMultimedia } from '../multimedia-post.entity';

@Entity()
export class Informative extends Post {
  @Column()
  type: string;

  @OneToMany(
    () => Comment,
    (comment) => comment.informative
  )
  comments: Comment[];

  @OneToMany(() => Report, report => report.informativePost, {cascade: true})
  reports: Report[];
  
  @OneToMany(() => PostLikes, postLikes => postLikes.informativePost, {cascade: true})
  postLikes: PostLikes[];

  @OneToMany(() => PostMultimedia, multimedia => multimedia.informativePost, {cascade: true})
  multimedia: PostMultimedia[];
}