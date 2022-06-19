import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { uuid } from "aws-sdk/clients/customerprofiles";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {

    constructor(private readonly jwtService: JwtService,
                private readonly configService: ConfigService,) {}

    async verifyToken(token: string, secret: string){

    }

    async decodeToken(token: string){
        return this.jwtService.decode(token)
    }

    generateJwtAccessToken(payload: {sub: number, email: string, sessionid: uuid}){
        return this.jwtService.sign(payload, {expiresIn: this.configService.get('access_token.expiresIn'), privateKey: this.configService.get('access_token.privateKey').replace(/\\n/gm, '\n')});
    }

    generateJwtRefreshToken(payload: {sub: number, email: string, sessionid: uuid}){
        return this.jwtService.sign(payload, {expiresIn: this.configService.get('refresh_token.expiresIn'), privateKey: this.configService.get('refresh_token.privateKey').replace(/\\n/gm, '\n')});
    }
}