import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, Req, Redirect, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh-token.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
import { EmailConfirmationGuard } from './guards/emailConfirmation.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly emailConfirmationService: EmailConfirmationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() response: Response) {
    return this.authService.login(req.user, response);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() response: Response){
    const user = await this.authService.register(createUserDto, response);
    await this.emailConfirmationService.sendVerificationLink(createUserDto.email);
    return user;
  }

  @UseGuards(JwtRefreshGuard, EmailConfirmationGuard)
  @Post('refresh')
  refresh(@Req() req, @Res() response: Response) {
    return  this.authService.getCookieWithJwtAccessToken(req.user, response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logOut(@Req() req, @Res() response: Response){
    return  this.authService.logOut(req.user, req, response);
  }
}
