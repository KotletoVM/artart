import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, Req, Redirect, UseInterceptors, UploadedFile, ForbiddenException, Query } from '@nestjs/common';
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
import { ApiTags, ApiOkResponse, ApiForbiddenResponse, ApiCreatedResponse, ApiBody, ApiUnauthorizedResponse, ApiBearerAuth, ApiExcludeEndpoint, ApiExcludeController } from '@nestjs/swagger';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';
import { RefreshSessionDto } from './dto/refreshSession.dto';
import { LoginDto } from './dto/login.dto';

@ApiExcludeController()
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly emailConfirmationService: EmailConfirmationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    let refreshSessionDto: RefreshSessionDto = {
      userid: req.user.id,
      ua: req.get('User-Agent'),
      fingerprint: loginDto.fingerprint || undefined,
      ip: req.ip || req.connection.remoteAddress
    }
    return this.authService.login(req.user, refreshSessionDto);
  }

  @Post('register')
  async register(@Request() req, @Body() createUserDto: CreateUserDto){
    const user = await this.authService.register(createUserDto);
    await this.emailConfirmationService.sendVerificationLink(createUserDto.email);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req, @Query('f') fingerprint: string) {
    if (!fingerprint) throw new ForbiddenException('Fingerprint must be provided')
    return this.authService.refreshSession(req.user, fingerprint, req.user.exp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logOut(@Req() req, @Body() body: {fingerprint: string}){
    if (!body.fingerprint) throw new ForbiddenException('Fingerprint must be provided')
    return this.authService.logOut(req.user, body.fingerprint);
  }
}
