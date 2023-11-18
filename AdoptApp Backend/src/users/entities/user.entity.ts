import { PostLikes } from "src/posts/entities/post-like.entity";
import { Post } from "src/posts/entities/post.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
        nullable: true,
        select: false
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
    
    @Column('text', { unique: true })
    //@Column('text')
    contact_email: string;

    @Column('text')
    instagram: string;

    @Column('text')
    facebook: string;

    @Column({ type: 'float', default: 0 })
    rating: number;

    @Column({ type: 'int', default: 0 })
    ratingCount: number;

    @Column('text', {
        nullable: true
    })
    region: string;

    @Column('text', {
        nullable: true
    })
    city: string;

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
        () => Follows,
        follows => follows.author,
        { cascade: true }
    )
    follows?: Follows[];

    @OneToMany(
        () => PostLikes, 
        postLikes => postLikes.user,
        { cascade: true }
    )
    likedPosts: PostLikes[];

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column('bool', {
        default: true
    })
    isActive: boolean

    @Column('int', { default: 0 })
    followersCount: number;

    @Column('int', { default: 0 })
    followingCount: number;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.nickname = this.nickname.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert;
    }
}   

