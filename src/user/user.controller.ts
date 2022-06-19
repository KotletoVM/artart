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
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiQuery, ApiExcludeController } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResetPasswordService } from 'src/reset-password/reset-password.service';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';

@ApiExcludeController()
@Controller('api/user')
export class UserController {
  constructor(
      private readonly userService: UserService,
      private readonly resetPasswordService: ResetPasswordService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    if ((take && !+take) || (skip && !+skip)) throw new BadRequestException('Query parameters must be specified as numbers')
    return this.userService.findAll(take, skip);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query() searchUserDto: SearchUserDto) {
    return this.userService.search(searchUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const {hash, role, updatedAt, isEmailConfirmed, ...find} = await this.userService.findById(+id);
    if (!find){throw new NotFoundException('User not found.');}
    return find;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.update(+req.user.id, updateUserDto);
  }

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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('me/deleteUserpic')
  async deleteUserpic(@Request() req) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
      return this.userService.deleteUserpic(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/updatePass')
  async updatePassword(@Request() req, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.updatePassword(+req.user.id, updateUserPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/updateEmail')
  async sendUpdateEmailLink(@Request() req, @Body() updateUserEmailDto: UpdateUserEmailDto) {
    return await this.userService.sendUpdateEmailLink(req.user, updateUserEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/updateEmail/:token')
  async updateEmail(@Request() req, @Param('token') token: string) {
    return await this.userService.updateEmail(req.user, token);
  }

  @Patch('password/reset')
  async sendResetLink(@Body() updateUserEmailDto: UpdateUserEmailDto) {
    const find = await this.userService.findByEmail(updateUserEmailDto.email);
    if (!find){throw new NotFoundException('User not found.');}
    return this.resetPasswordService.sendResetLink(updateUserEmailDto.email);
  }

  @Patch('password/reset/:token')
  async resetPassword(@Param('token') token: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    const email = await this.resetPasswordService.decodeConfirmationToken(token);
    return this.userService.resetPassword(email, updateUserPasswordDto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async updateRole(@Request() req, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.updateRole(+req.user.id, updateUserRoleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async remove(@Request() req) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.remove(+req.user.id);
  }
}
