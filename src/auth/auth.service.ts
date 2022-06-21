import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {HttpService} from "@nestjs/axios"
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from "@nestjs/config";
import { createHmac } from 'crypto';
import {S3, Endpoint} from 'aws-sdk';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { FileService } from 'src/file/file.service';
import { v4 as uuid } from 'uuid';
import { RefreshSession } from './entities/refreshSession.entity';
import { RefreshSessionDto } from './dto/refreshSession.dto';
@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService,
              @InjectRepository(User)
              private userRepository: Repository<User>,
              private configService: ConfigService,
              private httpService: HttpService,
              private fileService: FileService,
              @InjectRepository(RefreshSession)
              private sessionRepository: Repository<RefreshSession>
              ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.userService.findByCond({
      email
    });
    if(user){
        if (!user.isEmailConfirmed) throw new ForbiddenException('Необходимо подтвердить почту');
        if (await bcrypt.compare(password, user.hash)) {
            const {hash, ...result} = user;
            return result;
        }
        return null;
    }
    else{
        throw new ForbiddenException("Пользователь не найден");
    }
  }

    generateJwtAccessToken(payload: {sub: number, email: string, sessionid: uuid}){
      return this.jwtService.sign(payload, {expiresIn: this.configService.get('access_token.expiresIn'), privateKey: this.configService.get('access_token.privateKey').replace(/\\n/gm, '\n')});
    }

    generateJwtRefreshToken(payload: {sub: number, email: string, sessionid: uuid}){
        return this.jwtService.sign(payload, {expiresIn: this.configService.get('refresh_token.expiresIn'), privateKey: this.configService.get('refresh_token.privateKey').replace(/\\n/gm, '\n')});
    }

    async generateHash(password: string){
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async createSession(data: {sessionid: number, exp: number, fingerprint: string, userid: number, ip: string, ua: string}){
        const qb = this.sessionRepository.createQueryBuilder();
        return qb.insert().values({id: data.sessionid, expiresin: data.exp, fingerprint: data.fingerprint,
            userid: data.userid, ip: data.ip, ua: data.ua}).execute();
    }

    async findSession(sessionid: uuid){
        const qb = this.sessionRepository.createQueryBuilder();
        return qb.select().where({id: sessionid}).getOne()
    }

    async login(user: User, refreshSessionDto: RefreshSessionDto) {
        const sessionid = uuid();
        const payload = {sub: user.id, email: user.email, sessionid: sessionid};
        const accessToken = this.generateJwtAccessToken(payload);
        const refreshToken = this.generateJwtRefreshToken(payload);
        const exp = this.jwtService.decode(refreshToken)["exp"]
        await this.createSession({sessionid: sessionid, exp: exp, fingerprint: refreshSessionDto.fingerprint,
            userid: refreshSessionDto.userid, ip: refreshSessionDto.ip, ua: refreshSessionDto.ua})
        return {payload, accessToken, refreshToken};
    }

    async register(createUserDto: CreateUserDto){
      try {
          createUserDto.password = await this.generateHash(createUserDto.password);
          const {hash, ...user} = await this.userService.create(createUserDto);
          return {user};
      }
      catch (e) {
          if (e.constraint === this.configService.get('userConstraints.email')) throw new ForbiddenException("Пользователь с указанной почтой уже существует")
          if (e.constraint === this.configService.get('userConstraints.name')) throw new ForbiddenException("Пользователь с указанным псевдонимом уже существует")
          else throw new ForbiddenException(`Произошла ошибка ${e.code}: ${e.detail}.`)
      }
    }

    async saveUserpic(filename: string, userid: number, file:  Express.Multer.File){
        const newUserpic = await this.fileService.saveFile(filename, file);
        const user: UpdateUserDto = {id: undefined, password: undefined, name: undefined, role: undefined, email: undefined, userpic: newUserpic.Location};
        return this.userService.update(userid, user);
    }

    public async refreshSession(user: User, fingerprint: string, exp: number){
        const oldSession = await this.sessionRepository.findOne({userid: user.id, fingerprint: fingerprint, expiresin: exp})
        if (!oldSession){
            throw new ForbiddenException('Please login again')
        }
        const payload = {sub: user.id, email: user.email, sessionid: oldSession.id};
        const accessToken = this.generateJwtAccessToken(payload);
        const refreshToken = this.generateJwtRefreshToken(payload);
        this.sessionRepository.update({id: oldSession.id}, {expiresin: this.jwtService.decode(refreshToken)["exp"]})
        return {accessToken, refreshToken};
    }

    async logOut(user: User, fingerprint?: string){
      if (fingerprint){
          const session = await this.sessionRepository.findOne({userid: user.id, fingerprint: fingerprint})
          const qb = this.sessionRepository.createQueryBuilder()
          qb.delete().where({userid: user.id, fingerprint: fingerprint}).execute()
              .then(result => result.affected == 1 ? {message: 'Logout complete'} : new Error('Logout complete, but session not found'))
              .catch(e => {throw new Error(e)} )
      }
      else {
          const sessions = await this.sessionRepository.find({userid: user.id})
          const qb = this.sessionRepository.createQueryBuilder()
          qb.delete().where({userid: user.id}).execute()
              .then(result => result.affected != 0 ? {message: 'Logout complete'} : new Error('Logout complete, but session not found'))
              .catch(e => {throw new Error(e)} )
      }

    }
/*
    sign(key: string, string: string){
      return createHmac('sha-256', key).update(string);
    }

    createSignKey(date: Date, region: string, service: string, sign: string){
        const DateKey = this.sign("AWS4" + "SecretKey", date.toDateString()).digest('hex');
        const RegionKey = this.sign(DateKey, "ru-central1").digest('hex');
        const ServiceKey = this.sign(RegionKey, "s3").digest('hex');
        const SigningKey = this.sign(ServiceKey, "aws4_request").digest('hex')
        return SigningKey;
    }*/
}
