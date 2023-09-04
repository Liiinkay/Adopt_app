import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    nickname: string;

    @Column('text')
    name: string;

    @Column('text', {
        nullable: true
    })
    password: string;

    @Column('text')
    banner_multimedia: string;

    @Column('text')
    profile_img: string;

    @Column('text')
    last_name: string;

    @Column('text')
    rut: string;

    @Column('int', {
        default: 0
    })
    phone_number: number;

    @Column('text')
    contact_email: string;

    @Column('text')
    instagram: string;

    @Column('text')
    facebook: string;

    @OneToMany(
        () => Post,
        post => post.author
    )
    post: Post[];

    @Column('text',{
        array: true,
        default: []
    })
    saved_post?: string[];

    @Column('text',{
        array: true,
        default: []
    })
    followers: string[];

    @Column('text',{
        default: [],
        array: true
    })
    follows: string[];
}   

