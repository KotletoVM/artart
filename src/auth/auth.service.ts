import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user/user.service';
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

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService,
              @InjectRepository(HashedRefreshToken)
              private tokenRepository: Repository<HashedRefreshToken>,
              @InjectRepository(User)
              private userRepository: Repository<User>,
              private configService: ConfigService
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
        throw new ForbiddenException("User was not found.");
    }
  }

    generateJwtAccessToken(data: {id: number, email: string}, secret: string, expiresIn: string){
      const payload = { email: data.email, sub: data.id};
        return this.jwtService.sign(payload, {expiresIn: expiresIn, secret: secret});
    }

    generateJwtRefreshToken(data: {id: number, email: string}, secret: string, expiresIn: string){
        const payload = { email: data.email, sub: data.id};
        return this.jwtService.sign(payload, {expiresIn: expiresIn, secret: secret});
    }

    async generateHash(password: string){
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async login(user: User, response: Response) {
        const payload = { email: user.email, sub: user.id};
        const accessToken = this.generateJwtAccessToken(user, this.configService.get('access_token.secret'), this.configService.get('access_token.expiresIn'));
        const refreshToken = this.generateJwtRefreshToken(user, this.configService.get('refresh_token.secret'), this.configService.get('refresh_token.expiresIn'));
        const token = await bcrypt.hash(refreshToken, 10);
        this.saveRefreshToken({userid: user.id, token: token})
        response.cookie('access_token', accessToken, {
                httpOnly: true,
                domain: 'localhost',
                expires: new Date(Date.now() + 20000 * 60 * 60 * 24),
            }).cookie('refresh_token', refreshToken, {
            httpOnly: true,
            domain: 'localhost',
            expires: new Date(Date.now() + 20000 * 60 * 60 * 24),
        }).send({ success: payload });
        return payload;/* {
            ...payload,
            token: this.generateJwtToken(user),
        }*/;
    }

    saveRefreshToken(createHashedRefreshTokenDto: CreateHashedRefreshTokenDto){
        this.tokenRepository.save({userid: createHashedRefreshTokenDto.userid, token: createHashedRefreshTokenDto.token});
    }

    async register(createUserDto: CreateUserDto, response: Response){
      try {
          createUserDto.password = await this.generateHash(createUserDto.password);
          const {hash, ...user} = await this.userService.create(createUserDto);
          //const user = await this.userService.create(createUserDto);
          const accessToken = this.generateJwtAccessToken(user, this.configService.get('access_token.secret'), this.configService.get('access_token.expiresIn'));
          const refreshToken = this.generateJwtRefreshToken(user, this.configService.get('refresh_token.secret'), this.configService.get('refresh_token.expiresIn'));
          const token = await bcrypt.hash(refreshToken, 10);
          this.saveRefreshToken({userid: user.id, token: token})
          //this.tokenRepository.save({userid: user.id, token: token});
          response.cookie('access_token', accessToken, {
              httpOnly: true,
              domain: 'localhost',
              expires: new Date(Date.now() + 20000 * 60 * 60 * 24),
          }).cookie('refresh_token', refreshToken, {
              httpOnly: true,
              domain: 'localhost',
              expires: new Date(Date.now() + 20000 * 60 * 60 * 24),
          }).send({ success: user });
      }
      catch (e) {
          /*УМЕНЬШИТЬ КОЛИЧЕСТВО ВЫВОДИМЫХ ДАННЫХ*/
          throw new ForbiddenException(e);
      }
    }

    public getCookieWithJwtAccessToken(user: User, response: Response) {
        const accessToken = this.generateJwtAccessToken(user, this.configService.get('access_token.secret'), this.configService.get('access_token.expiresIn'));
        response.cookie('access_token', accessToken, {
            httpOnly: true,
            domain: 'localhost',
            expires: new Date(Date.now() + 20000 * 60 * 60 * 24)}).send({ success: [user.name, user.email] });
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
        response.clearCookie('access_token').clearCookie('refresh_token').send({ success: [user.name, user.email] })
    }

}
