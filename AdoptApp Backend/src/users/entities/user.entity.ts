import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Followers } from "./followers.entity";
import { Follows } from "./follows.entity";
import { SavedPost } from "./saved-post.entity";

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
        post => post.author,
        { cascade: true }
    )
    post?: Post[];

    @OneToMany(
        () => SavedPost,
        savedpost => savedpost.author,
        { cascade: true }
    )
    saved_post?: SavedPost[];

    @OneToMany(
        () => Followers,
        followers => followers.author,
        { cascade: true }
    )
    followers?: Followers[];


    @OneToMany(
        () => Follows,
        follows => follows.author,
        { cascade: true }
    )
    follows?: Follows[];

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]
}   

