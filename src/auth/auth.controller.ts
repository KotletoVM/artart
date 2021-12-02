import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, Req, Redirect, UseInterceptors, UploadedFile, ForbiddenException } from '@nestjs/common';
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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly emailConfirmationService: EmailConfirmationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  async register(@Body() createUserDto: CreateUserDto, @UploadedFile() userpic?: Express.Multer.File){
    if (userpic){
      if (userpic.mimetype != 'image/jpeg' && userpic.mimetype != 'image/png'){
        throw new ForbiddenException('userpic must be image (jpg, jpeg or png)')
      }
      if (userpic.size >= 5000000){
        throw new ForbiddenException('userpic size must be less then 5 Mb');
      }
    }
    const user = await this.authService.register(createUserDto, userpic);
    await this.emailConfirmationService.sendVerificationLink(createUserDto.email);
    return user;
  }

  @UseGuards(JwtRefreshGuard, /*EmailConfirmationGuard*/)
  @Post('refresh')
  refresh(@Req() req) {
    console.log(req.user)
    return  this.authService.getJwtAccessToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logOut(@Req() req, @Res() response: Response){
    return  this.authService.logOut(req.user, req, response);
  }
}
