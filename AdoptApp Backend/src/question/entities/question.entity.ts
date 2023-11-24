import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Adopt } from '../../posts/entities/typepost-entitys/adopt-post.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ nullable: true })
  answer: string;

  @CreateDateColumn({ type: 'timestamptz' })
  askedOn: Date;

  @ManyToOne(() => Adopt, adoptPost => adoptPost.questions, { onDelete: 'CASCADE' })
  adoptPost: Adopt;

  @Column()
  author: string;
}