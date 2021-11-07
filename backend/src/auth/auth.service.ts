import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
              private jwtService: JwtService) {}

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

    generateJwtToken(data: {id: number, email: string}){
      const payload = { email: data.email, sub: data.id};
        return this.jwtService.sign(payload);
    }

    async generateHash(password: string){
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user.id};
        return {
            ...payload,
            token: this.generateJwtToken(user),
        };
    }

    async register(createUserDto: CreateUserDto){
      try {
          createUserDto.password = await this.generateHash(createUserDto.password);
          const {hash, ...user} = await this.userService.create(createUserDto);
          //const user = await this.userService.create(createUserDto);
          return {
              user,
              token: this.generateJwtToken(user)
          }
      }
      catch (e) {
          throw new ForbiddenException(e);
      }
    }
}
