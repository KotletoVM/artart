import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Request, Query, Redirect, HttpCode, Res, Inject, forwardRef, UseInterceptors, UploadedFile, ForbiddenException } from '@nestjs/common';
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
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResetPasswordService } from 'src/reset-password/reset-password.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
      private readonly emailConfirmationService: EmailConfirmationService,
      private readonly userService: UserService,
      private readonly resetPasswordService: ResetPasswordService) {}

  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.userService.findAll(take, skip);
  }

  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id)
  }

  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get('search')
  search(@Query() searchUserDto: SearchUserDto) {
    return this.userService.search(searchUserDto);
  }

  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const {hash, role, updatedAt, email, isEmailConfirmed, ...find} = await this.userService.findById(+id);
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
        throw new ForbiddenException('userpic must be image (jpg, jpeg or png)')
      }
      if (userpic.size >= 5000000){
        throw new ForbiddenException('userpic size must be less then 5 Mb');
      }
      const find = await this.userService.findById(+req.user.id);
      if (!find){throw new NotFoundException('User not found.');}
      return this.userService.updateUserpic(req.user, userpic);
    }
    throw new ForbiddenException('to update userpic upload new userpic first.');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/updatePass')
  async updatePassword(@Request() req, @Body() updateUserPasswordDto: UpdateUserPasswordDto, @Res() responce: Response) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.updatePassword(+req.user.id, updateUserPasswordDto, responce);
  }


  @UseGuards(JwtAuthGuard)
  @Patch('me/updateEmail')
  async updateEmail(@Request() req, @Body() updateUserEmailDto: UpdateUserEmailDto, @Res() responce: Response) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    const user = await this.userService.updateEmail(+req.user.id, updateUserEmailDto, responce);
    await this.emailConfirmationService.sendVerificationLink(updateUserEmailDto.email);
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
