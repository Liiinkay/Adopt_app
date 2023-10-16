import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lost } from 'src/posts/entities/typepost-entitys/lost-post.entity';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Lost)
    private readonly lostRepository: Repository<Lost>,
  ) {}

  async createLostComment(id: string, commentData: any): Promise<Comment> {
    const comment = new Comment();
    comment.text = commentData.text;
    
    // Obtén la publicación (Informative o Lost) por su ID y establece la relación
    // Reemplaza 'Post' con la entidad real utilizada en tu aplicación
    // según el tipo de publicación (Informative o Lost).
    // Asegúrate de importar la entidad correspondiente.
    const post = await this.lostRepository.findOneBy({ id: id });
    comment.lost = post;

    return await this.commentRepository.save(comment);
  }

  
}
