import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Request, Query, Redirect, HttpCode, Res, Inject, forwardRef, UseInterceptors, UploadedFile, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserRole } from 'src/enums/role.enum';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { EmailConfirmationGuard } from 'src/auth/guards/emailConfirmation.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Response } from 'express';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResetPasswordService } from 'src/reset-password/reset-password.service';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
      private readonly emailConfirmationService: EmailConfirmationService,
      private readonly userService: UserService,
      private readonly resetPasswordService: ResetPasswordService) {}

  @ApiOkResponse({
    status: 200,
    description: 'Users received',
    schema: {
      type: 'object',
      properties: {
        "users": {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              "id": {
                type: 'integer'
              },
              "name": {
                type: 'string'
              },
              "userpic": {
                type: 'string'
              }
            }
          }
        },
        "count": {
          type: 'integer'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiQuery({
    name: 'take',
    type: 'number',
    required: false
  })
  @ApiQuery({
    name: 'skip',
    type: 'number',
    required: false
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    if ((take && !+take) || (skip && !+skip)) throw new BadRequestException('Query parameters must be specified as numbers')
    return this.userService.findAll(take, skip);
  }

  @ApiOkResponse({
    status: 200,
    description: 'User\'s information received',
    schema: {
      type: 'object',
      properties: {
        "id": {
          type: 'integer'
        },
        "name": {
          type: 'string'
        },
        "email": {
          type: 'string',
          format: 'email'
        },
        "createdAt": {
          type: 'string',
          format: 'date-time'
        },
        "updatedAt": {
          type: 'string',
          format: 'date-time'
        },
        "userpic": {
          type: 'string'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id)
  }

  @ApiOkResponse({
    status: 200,
    description: 'Users received',
    schema: {
      type: 'object',
      properties: {
        "users": {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              "id": {
                type: 'integer'
              },
              "name": {
                type: 'string'
              },
              "userpic": {
                type: 'string'
              }
            }
          }
        },
        "count": {
          type: 'integer'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get('search')
  search(@Query() searchUserDto: SearchUserDto) {
    return this.userService.search(searchUserDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'User received',
    schema: {
      type: 'object',
      properties: {
        "id": {
          type: 'integer'
        },
        "name": {
          type: 'string'
        },
        "email": {
          type: 'string',
          format: 'email'
        },
        "createdAt": {
          type: 'string',
          format: 'date-time'
        },
        "userpic": {
          type: 'string'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const {hash, role, updatedAt, isEmailConfirmed, ...find} = await this.userService.findById(+id);
    if (!find){throw new NotFoundException('User not found.');}
    return find;
  }

  @ApiOkResponse({
    status: 200,
    description: 'User updated',
    schema: {
      type: 'object',
      properties: {
        "name": {
          type: 'object'
        },
        "userpic": {
          type: 'object'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.update(+req.user.id, updateUserDto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        "file": {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiOkResponse({
    status: 200,
    description: 'Userpic updated',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        },
        "url": {
          type: 'string'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('me/updateUserpic')
  async updateUserpic(@Request() req, @UploadedFile() userpic?: Express.Multer.File) {
    if (userpic){
      if (userpic.mimetype != 'image/jpeg' && userpic.mimetype != 'image/png'){
        throw new BadRequestException('userpic must be image (jpg, jpeg or png)')
      }
      if (userpic.size >= 5000000){
        throw new BadRequestException('userpic size must be less then 5 Mb');
      }
      const find = await this.userService.findById(+req.user.id);
      if (!find){throw new NotFoundException('User not found.');}
      return this.userService.updateUserpic(req.user, userpic);
    }
    throw new BadRequestException('to update userpic upload new userpic first.');
  }

  @ApiOkResponse({
    status: 200,
    description: 'Password updated',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard)
  @Patch('me/updatePass')
  async updatePassword(@Request() req, @Body() updateUserPasswordDto: UpdateUserPasswordDto, @Res() responce: Response) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.updatePassword(+req.user.id, updateUserPasswordDto, responce);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Email updated',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard)
  @Patch('me/updateEmail')
  async updateEmail(@Request() req, @Body() updateUserEmailDto: UpdateUserEmailDto, @Res() responce: Response) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    const user = await this.userService.updateEmail(+req.user.id, updateUserEmailDto, responce);
    await this.emailConfirmationService.sendVerificationLink(updateUserEmailDto.email);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Reset password email sent',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        },
        "emailId": {
          type: 'string'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @Patch('password/reset')
  async sendResetLink(@Body() updateUserEmailDto: UpdateUserEmailDto) {
    const find = await this.userService.findByEmail(updateUserEmailDto.email);
    if (!find){throw new NotFoundException('User not found.');}
    return this.resetPasswordService.sendResetLink(updateUserEmailDto.email);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Reset password email sent',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @Patch('password/reset/:token')
  async resetPassword(@Param('token') token: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    const email = await this.resetPasswordService.decodeConfirmationToken(token);
    return this.userService.resetPassword(email, updateUserPasswordDto);
  }

  /*-------------------РАЗОБРАТЬСЯ С РОЛЯМИ---------------------*/
  @ApiOkResponse({
    status: 200,
    description: 'Role changed',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async updateRole(@Request() req, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.updateRole(+req.user.id, updateUserRoleDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'User deleted',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found',
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async remove(@Request() req) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.remove(+req.user.id);
  }
}
