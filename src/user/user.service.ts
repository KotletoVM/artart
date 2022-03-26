import { Injectable, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
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
import { Response } from 'express';
import { FileService } from 'src/file/file.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      @InjectRepository(HashedRefreshToken)
      private tokenRepository: Repository<HashedRefreshToken>,
      private fileService: FileService
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save({
      name: createUserDto.name,
      email: createUserDto.email,
      hash: createUserDto.password,
      //role: createUserDto.role,
    });
  }

  async updateUserpic(user: User, userpic: Express.Multer.File){
    const filename = `userpic/${uuid()}-${user.id}.png`;
    const newUserpic = await this.fileService.saveFile(filename, userpic);
    if (!user.userpic.includes('userpic.png')){
      this.fileService.deleteFile(user.userpic);
    }
    await this.userRepository.update(user.id, {userpic: newUserpic.Location});
    return {message: 'Userpic has been updated', url: newUserpic.Location}
  }

  async findAll(take: number = 10, skip: number = 0) {
    const qb = this.userRepository.createQueryBuilder('user');
    const [users, count] = await qb.select(["user.id", "user.name", "user.userpic"]).take(take).skip(skip).getManyAndCount();
    return {users, count}
  }

  findById(id: number) {
    return this.userRepository.findOne(id);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({email: email});
  }



  async search(searchUserDto: SearchUserDto) {
    const qb = this.userRepository.createQueryBuilder('user');

    if (searchUserDto.name){qb.andWhere(`user.name ILIKE :name`);}

    qb.setParameters({
      name: `%${searchUserDto.name}%`
    })
    const [users, count] = await  qb.select(["user.id", "user.name", "user.userpic"]).getManyAndCount();
    return {users, count};

  }

  findByCond(cond: LoginUserDto){
    return this.userRepository.findOne(cond);
  }

  async getProfile(id: number){
    const qb = this.userRepository.createQueryBuilder('user');
    const user = await qb.select(["user.id", "user.name", "user.userpic", "user.email", "user.createdAt", "user.updatedAt"]).where("user.id = :id", {id: id}).getOne();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let name,userpic;
    if (updateUserDto.name){name = await this.userRepository.update(id, {name: updateUserDto.name})};
    if (updateUserDto.userpic){userpic = await this.userRepository.update(id, {userpic: updateUserDto.userpic})};
    return {name, userpic};
  }

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto, response: Response){
    if (updateUserPasswordDto.password){
      const hash = await bcrypt.hash(updateUserPasswordDto.password, 10);
      const hashUpdate = await this.userRepository.update(id, {hash: hash});
      if (hashUpdate){response.clearCookie('access_token').clearCookie('refresh_token').send({message: 'Password updated'});
      }
      else throw new BadRequestException('Something wrong');
    }
    else throw new BadRequestException('To update password enter new password');
  }

  async updateEmail(id: number, updateUserEmailDto: UpdateUserEmailDto, response: Response){
    if (updateUserEmailDto.email){
      const emailUpdate = await this.userRepository.update(id, {email: updateUserEmailDto.email, isEmailConfirmed: false});
      if (emailUpdate){response.clearCookie('access_token').clearCookie('refresh_token').send({message: 'Email updated. Confirm new email.'});
    }
      else throw new BadRequestException('Something wrong');
    }
    else throw new BadRequestException('To update email enter new email');

    //logout
  }

  //ограничение на админа
  async updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto){
    return this.userRepository.update(id, {role: updateUserRoleDto.role})
  }

  async resetPassword(email: string, updateUserPasswordDto: UpdateUserPasswordDto){
    const user = await this.findByEmail(email);
    if (!user){throw new NotFoundException('User not found.');}
    if (updateUserPasswordDto['password']){
      const hash = await bcrypt.hash(updateUserPasswordDto.password, 10);
      await this.userRepository.update(user.id, {hash: hash});
      return {message: "Password reset complete"}
    }
    else throw new BadRequestException('To reset password enter new password');
  }

  async remove(id: number){
    this.tokenRepository.delete({userid: id});
    return this.userRepository.delete(id)
        .then(() => {return {message: "User deleted"}})
        .catch((err) => { throw new BadRequestException("Something went wrong.")});
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update({ email: email }, {
      isEmailConfirmed: true
    });
  }
}
