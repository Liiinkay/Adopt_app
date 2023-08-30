import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Url } from "url";

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

    //post: string[];

    //saved_post: string[];

    //followers: string[];

    //follows: string[];
}   

