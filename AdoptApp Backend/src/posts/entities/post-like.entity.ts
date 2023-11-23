import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Adopt } from './typepost-entitys/adopt-post.entity';
import { Lost } from './typepost-entitys/lost-post.entity';
import { Informative } from './typepost-entitys/informative-post.entity';

@Entity()
export class PostLikes {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(
        () => User, 
        user => user.likedPosts,
        { nullable: true }
    )
    user: User;

    @ManyToOne(() => Adopt, adoptPost => adoptPost.postLikes, { nullable: true })
    adoptPost: Adopt;

    @ManyToOne(() => Lost, lostPost => lostPost.postLikes, { nullable: true })
    lostPost: Lost;

    @ManyToOne(() => Informative, informativePost => informativePost.postLikes, { nullable: true })
    informativePost: Informative;
}