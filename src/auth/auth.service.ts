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
import { HashedRefreshToken } from 'src/hashed-refresh-token/entities/hashed-refresh-token.entity';
import { CreateHashedRefreshTokenDto } from 'src/hashed-refresh-token/dto/create-hashed-refresh-token.dto';
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
              @InjectRepository(HashedRefreshToken)
              private tokenRepository: Repository<HashedRefreshToken>,
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
    /*if (user && user.hash === password) {
      const { password, ...result } = user;
      return result;
    }*/
    if(user){
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

    generateJwtAccessToken(payload: {sub: number, email: string}){
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

    async register(createUserDto: CreateUserDto, refreshSessionDto: RefreshSessionDto, file?: Express.Multer.File){
      try {
          createUserDto.password = await this.generateHash(createUserDto.password);
          const {hash, ...user} = await this.userService.create(createUserDto);
          if(file){
              const filename = `userpic/${uuid()}-${user.id}.png`;
              const userpicUpload = this.saveUserpic(filename, user.id, file);
          }
          const sessionid = uuid();
          const payload = {sub: user.id, email: user.email, sessionid: sessionid};
          const accessToken = this.generateJwtAccessToken(payload);
          const refreshToken = this.generateJwtRefreshToken(payload);
          const exp = this.jwtService.decode(refreshToken)["exp"]
          await this.createSession({sessionid: sessionid, exp: exp, fingerprint: refreshSessionDto.fingerprint,
              userid: user.id, ip: refreshSessionDto.ip, ua: refreshSessionDto.ua})
          return {user, accessToken, refreshToken};
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

    public getJwtAccessToken(user: User) {
        const payload = {sub: user.id, email: user.email};
        const accessToken = this.generateJwtAccessToken(payload);
        return accessToken;
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

    async getUserIfRefreshTokenMatches(refreshToken: string, userid: number) {
        //const user = await this.findById(userId);
        const token = await this.tokenRepository.find({userid: userid});
        let isRefreshTokenMatching = false;
        token.forEach(element => {
            if (bcrypt.compare(refreshToken, element.token)) {
                isRefreshTokenMatching = true;
                return isRefreshTokenMatching;
            }
        });

        if (isRefreshTokenMatching) {
            const user = await this.userRepository.findOne({id: userid});
            return user;
        }
    }

    async logOut(user: User, req: Request, response: Response){
        const cookie_token: string = await req.cookies['refresh_token'];
        const tokens = await this.tokenRepository.find();
        tokens.forEach(async token => {
            if (await bcrypt.compare(cookie_token, token.token)){
                console.log(cookie_token, token.token);
                this.tokenRepository.delete({token: token.token});
            }
        })
        response.clearCookie('access_token').clearCookie('refresh_token').send({ name: user.name})
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
