import { Entity, Column, OneToMany } from 'typeorm';
import { Form } from '../form.entity';
import { Post } from '../post.entity';

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

  @OneToMany(
    () => Form,
    form => form.author,
    {cascade: true }
  )
  form: Form[]

  @Column('text',{
    array: true,
    default: []
  })
  coment: string[]
}