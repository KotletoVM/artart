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
import { ApiTags, ApiOkResponse, ApiForbiddenResponse, ApiCreatedResponse, ApiBody, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';
import { RefreshSessionDto } from './dto/refreshSession.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly emailConfirmationService: EmailConfirmationService) {}

  @ApiBody({
    type: LoginDto
  })
  @ApiCreatedResponse({
    status: 201,
    description: "User logged in",
    schema: {
      type: 'object',
      properties: {
        "payload": {
          type: 'object',
          properties: {
            "email": {
              type: 'string',
              format: 'email'
            },
            "sub": {
              type: "integer"
            }
          }
        },
        "accessToken": {},
        "refreshToken": {}
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User login failed",
    type: ClientErrorResponseSchema
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    let refreshSessionDto: RefreshSessionDto = {
      userid: req.user.id,
      ua: req.get('User-Agent'),
      fingerprint: loginDto.fingerprint,
      ip: req.connection.remoteAddress
    }
    return this.authService.login(req.user, refreshSessionDto);
  }

  @ApiCreatedResponse({
    status: 201,
    description: "User registered",
    schema: {
      type: 'object',
      properties: {
        "user": {
          type: 'object',
          properties: {
            "name": {},
            "email": {
              type: 'string',
              format: 'email'
            },
            "id": {
              type: "integer"
            },
            "createdAt": {
              type: 'string',
              format: 'date-time'
            },
            "updatedAt": {
              type: 'string',
              format: 'date-time'
            },
            "role": {},
            "userpic": {},
            "isEmailConfirmed": {
              type: "boolean"
            }
          }
        },
        "accessToken": {},
        "refreshToken": {}
      }
    }
  })
  @ApiForbiddenResponse({
    status: 403,
    description: "User registration failed",
    type: ClientErrorResponseSchema
  })
  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  async register(@Request() req, @Body() createUserDto: CreateUserDto, @UploadedFile() userpic?: Express.Multer.File){
    if (userpic){
      if (userpic.mimetype != 'image/jpeg' && userpic.mimetype != 'image/png'){
        throw new ForbiddenException('userpic must be image (jpg, jpeg or png)')
      }
      if (userpic.size >= 5000000){
        throw new ForbiddenException('userpic size must be less then 5 Mb');
      }
    }
    let refreshSessionDto: RefreshSessionDto = {
      ua: req.get('User-Agent'),
      fingerprint: createUserDto.fingerprint,
      ip: req.connection.remoteAddress
    }
    const user = await this.authService.register(createUserDto, refreshSessionDto, userpic);
    await this.emailConfirmationService.sendVerificationLink(createUserDto.email);
    return user;
  }

  @ApiCreatedResponse({
    status: 201,
    description: "New access token achieved",
    schema: {
      type: 'string'
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    schema: {
      type: "object",
      properties: {
        "statusCode": {
          type: "integer"
        },
        "message": {}
      }
    }
  })
  @ApiBearerAuth('jwt-refresh-user')
  @UseGuards(JwtRefreshGuard, /*EmailConfirmationGuard*/)
  @Post('refresh')
  refresh(@Req() req, @Query('f') fingerprint: string) {
    return this.authService.refreshSession(req.user, fingerprint, req.user.exp);
  }

  @ApiCreatedResponse({
    status: 201,
    description: "Logout complete",
    schema: {
      type: 'object',
      properties: {
        "name": {}
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User already logged out",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logOut(@Req() req, @Res() response: Response){
    return  this.authService.logOut(req.user, req, response);
  }
}
