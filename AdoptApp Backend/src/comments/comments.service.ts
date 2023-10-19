import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lost } from 'src/posts/entities/typepost-entitys/lost-post.entity';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Informative } from '../posts/entities/typepost-entitys/informative-post.entity';


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Lost)
    private readonly lostRepository: Repository<Lost>,
    @InjectRepository(Informative)
    private readonly informativeRepository: Repository<Informative>
  ) {}

  async createLostComment(id: string, commentData: any): Promise<Comment> {
    //Se comprueba la existencia del Post
    const post = await this.lostRepository.findOneBy({ id: id });

    if ( !post )
    throw new NotFoundException(`Product with id ${ id } not found`);
    
    const comment = new Comment();
    comment.text = commentData.text;
    //Se establece la relacion
    comment.lost = post;

    return await this.commentRepository.save(comment);
  }

  async createInformativeComment(id: string, commentData: any): Promise<Comment> {
    //Se comprueba la existencia del Post
    const post = await this.informativeRepository.findOneBy({ id: id });

    if ( !post )
    throw new NotFoundException(`Product with id ${ id } not found`);
    
    const comment = new Comment();
    comment.text = commentData.text;
    //Se establece la relacion
    comment.informative = post;

    return await this.commentRepository.save(comment);
  }

  // Función para crear una respuesta a un comentario
  async createReply(parentId: string, replyData: any): Promise<Comment> {
    //Se comprueba la existencia del Post
    const parentComment = await this.commentRepository.findOneBy({id: parentId});

    if ( !parentComment )
    throw new NotFoundException(`Product with id ${ parentId } not found`);

    const reply = new Comment();
    reply.text = replyData.text;
    //Se establece la relacion
    reply.parentComment = parentComment;

    return await this.commentRepository.save(reply);
  }
  
  // Función para obtener todos los comentarios de una publicación
  async getCommentsForLostPost(postId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { lost: { id: postId } },
      relations: ['replies'], // Esto traerá las respuestas de cada comentario
    });
  }

  // Función para obtener todos los comentarios de una publicación
  async getCommentsForInformativePost(postId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { informative: { id: postId } },
      relations: ['replies'], // Esto traerá las respuestas de cada comentario
    });
  }

  async deleteComment(commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOneBy({id: commentId});
    if (!comment) {
      throw new NotFoundException('El comentario no se encontró');
    }
    await this.commentRepository.remove(comment);
  }
}
