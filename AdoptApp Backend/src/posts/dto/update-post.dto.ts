import { PartialType } from '@nestjs/mapped-types';
import { CreateAdoptDto } from './adopt-post.dto';

export class UpdatePostDto extends PartialType(CreateAdoptDto) {}
