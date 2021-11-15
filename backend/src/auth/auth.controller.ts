import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh-token.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() response: Response) {
    return this.authService.login(req.user, response);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto, @Res() response: Response){
    return this.authService.register(createUserDto, response);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req, @Res() response: Response) {
    return  this.authService.getCookieWithJwtAccessToken(req.user, response);
  }

}
