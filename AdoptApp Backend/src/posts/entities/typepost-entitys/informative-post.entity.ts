import { Entity, Column, OneToMany } from 'typeorm';
import { Post } from '../post.entity';
import { Comment } from '../../../comments/entities/comment.entity';
import { Report } from 'src/reports/entities/report.entity';
import { PostLikes } from '../post-like.entity';

@Entity()
export class Informative extends Post {
  @Column()
  tipo: string;

  @OneToMany(
    () => Comment,
    (comment) => comment.informative
  )
  comments: Comment[];

  @OneToMany(() => Report, report => report.informativePost)
  reports: Report[];
  
  @OneToMany(() => PostLikes, postLikes => postLikes.informativePost)
  postLikes: PostLikes[];

}