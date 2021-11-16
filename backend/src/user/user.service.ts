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
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { HashedRefreshToken } from 'src/hashed-refresh-token/entities/hashed-refresh-token.entity';

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      @InjectRepository(HashedRefreshToken)
      private tokenRepository: Repository<HashedRefreshToken>
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save({
      name: createUserDto.name,
      email: createUserDto.email,
      hash: createUserDto.password,
      //role: createUserDto.role,
      userpic: createUserDto.userpic
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findById(id: number) {
    return this.userRepository.findOne(id);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({email: email});
  }



  async search(searchUserDto: SearchUserDto) {
    const qb = this.userRepository.createQueryBuilder('searchQueryBuilder');

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
    return this.userRepository.findOne(cond);
  }

  async getProfile(id: number){
    const qb = this.userRepository.createQueryBuilder('user');
    const user = await qb.select(["user.id", "user.name", "user.userpic", "user.email", "user.createdAt", "user.updatedAt"]).where("user.id = :id", {id: id}).getOne();
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto){
    const hash = await bcrypt.hash(updateUserPasswordDto.password, 10);
    return this.userRepository.update(id, {hash: hash});
    //logout
  }

  async updateEmail(id: number, updateUserEmailDto: UpdateUserEmailDto){
    return this.userRepository.update(id, {email: updateUserEmailDto.email});
    //logout
  }

  //ограничение на админа
  async updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto){
    return this.userRepository.update(id, {role: updateUserRoleDto.role})
  }

  async remove(id: number){
    this.tokenRepository.delete({userid: id});
    return this.userRepository.delete(id);
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update({ email: email }, {
      isEmailConfirmed: true
    });
  }
}
