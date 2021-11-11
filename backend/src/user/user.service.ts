import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save({
      name: createUserDto.name,
      email: createUserDto.email,
      hash: createUserDto.password
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findById(id: number) {
    return this.usersRepository.findOne(id);
  }

  async search(searchUserDto: SearchUserDto) {
    const qb = this.usersRepository.createQueryBuilder('searchQueryBuilder');

    if (searchUserDto.name){qb.andWhere(`searchQueryBuilder.name ILIKE :name`);}

    if (searchUserDto.email){qb.andWhere(`searchQueryBuilder.email ILIKE :email`);}

    qb.setParameters({
      name: `%${searchUserDto.name}%`,
      email:`%${searchUserDto.email}%`
    })
    let [users, number] = await  qb.getManyAndCount();
    return {users, number};

  }

  findByCond(cond: LoginUserDto){
    return this.usersRepository.findOne(cond);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto){
    const hash = await bcrypt.hash(updateUserPasswordDto.password, 10);
    return this.usersRepository.update(id, {hash: hash});
  }

  async updateEmail(id: number, updateUserEmailDto: UpdateUserEmailDto){
    return this.usersRepository.update(id, {email: updateUserEmailDto.email});
  }
  /*remove(id: number) {
    return this.usersRepository.delete(id);
  }*/
}
