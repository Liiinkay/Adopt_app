import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Coordinates {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  latitude: string;

  @Column('text')
  longitude: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'text', nullable: true })
  imageURL: string | null;
}