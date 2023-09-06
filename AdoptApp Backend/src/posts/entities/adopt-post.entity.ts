import { Entity, Column } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Adopt extends Post {

  @Column()
  state: string;

  @Column()
  gender: string;

  @Column()
  age: number;

  @Column()
  personality: string;

  @Column()
  medical_information: string;

  @Column('text',{
    array: true,
    default: []
  })
  form: string[]

  @Column('text',{
    array: true,
    default: []
  })
  coment: string[]
}