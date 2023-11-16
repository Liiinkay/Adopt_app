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
    comment.author = commentData.authorId;
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
    comment.author = commentData.authorId;

    //Se establece la relacion
    comment.informative = post;

    return await this.commentRepository.save(comment);
  }

  //Funcion de respuesta de comentario
  async createReply(commentId: string, commentData: CreateCommentDto): Promise<Comment> {
    const parentComment = await this.commentRepository.findOneBy({ id: commentId });
    if (!parentComment) {
      throw new NotFoundException(`Comentario con id ${commentId} no encontrado`);
    }
  
    const reply = new Comment();
    reply.text = commentData.text;
    reply.author = commentData.authorId; 
    reply.parentComment = parentComment;
  
    // Se guarda la respuesta en la base de datos
    return await this.commentRepository.save(reply);
  }
  
  async getPostWithComments(postId: string): Promise<any> {
    let post = await this.informativeRepository.findOne({
      where: { id: postId },
      relations: ['comments', 'comments.replies']
    });

    if (!post) {
      post = await this.lostRepository.findOne({
        where: { id: postId },
        relations: ['comments', 'comments.replies']
      });
    }

    if (!post) {
      throw new NotFoundException(`Post con ID ${postId} no encontrado`);
    }

    return post;
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    let post = await this.informativeRepository.findOne({
      where: { id: postId },
      relations: ['comments', 'comments.replies']
    });

    if (!post) {
      post = await this.lostRepository.findOne({
        where: { id: postId },
        relations: ['comments', 'comments.replies']
      });
    }

    if (!post) {
      throw new NotFoundException(`Post con ID ${postId} no encontrado`);
    }

    return post.comments;
  }

  async deleteComment(commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOneBy({id: commentId});
    if (!comment) {
      throw new NotFoundException('El comentario no se encontró');
    }
    await this.commentRepository.remove(comment);
  }
}
