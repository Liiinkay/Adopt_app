import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Adopt } from './typepost-entitys/adopt-post.entity';

@Entity()
export class Form{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date;

    @Column({ type: 'boolean', default: false })
    state: boolean;

    @Column()
    city: string;

    @Column()
    rut: string;
    
    @Column()
    adress: string;
    
    @Column()
    phone: string;

    @Column()
    question1: string;

    @Column({ type: 'boolean', default: false })
    question2: boolean;

    @Column({ type: 'boolean', default: false })
    question3: boolean;

    @Column({ type: 'boolean', default: false })
    question4: boolean;

    @Column() 
    question5: string;

    @Column() 
    question6: string;

    @Column({ type: 'boolean', default: false })
    question7: boolean;

    @Column({ type: 'boolean', default: false })
    question8: boolean;

    @Column({ type: 'boolean', default: false })
    question9: boolean;

    @Column() 
    question10: string;

    @Column()
    idApplicant: string

    @Column({ default: 'pending' })
    status: string;

    @ManyToOne(
        () => Adopt,
        adopt => adopt.form,
        {onDelete: 'CASCADE'}
    )
    post: Adopt
}