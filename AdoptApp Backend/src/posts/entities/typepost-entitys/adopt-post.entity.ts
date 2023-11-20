import { Question } from 'src/question/entities/question.entity';
import { Report } from 'src/reports/entities/report.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Form } from '../form.entity';
import { PostMultimedia } from '../multimedia-post.entity';
import { PostLikes } from '../post-like.entity';
import { Post } from '../post.entity';

@Entity()
export class Adopt extends Post {

  @Column()
  state: string;

  @Column()
  gender: string;

  @Column({ nullable: false, default: 0 })
  age: string;

  @Column()
  personality: string;

  @Column()
  medical_information: string;

  @OneToMany(() => Form, form => form.post, {cascade: true })
  form: Form[]

  @ManyToOne(() => Question, question => question.adoptPost, { cascade: true })
  questions: Question[];

  @Column('text',{
    array: true,
    default: []
  })
  coment: string[]

  @OneToMany(() => Report, report => report.adoptPost)
  reports: Report[];

  @OneToMany(() => PostLikes, postLikes => postLikes.adoptPost)
  postLikes: PostLikes[];

  @OneToMany(() => PostMultimedia, multimedia => multimedia.adoptPost)
  multimedia: PostMultimedia[];
}