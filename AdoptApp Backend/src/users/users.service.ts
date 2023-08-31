import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {validate as isUUID} from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try{
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch(error){
      this.hadleDBExceptions(error);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(term: string) {
    let user: User;

    if (isUUID(term) ){
      user = await this.userRepository.findOneBy({ id: term });
    }

    if ( !user )
    throw new NotFoundException(`Product with id ${ term } not found`);

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private hadleDBExceptions( error: any ){
    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);    

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
