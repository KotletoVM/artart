import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Request, Query, Redirect } from '@nestjs/common';
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

//ограничение на авторизованного пользователя
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id)
  }

  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Get('search')
  search(@Query() searchUserDto: SearchUserDto) {
    return this.userService.search(searchUserDto);
  }

  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const {hash, role, updatedAt, email, ...find} = await this.userService.findById(+id);
    if (!find){throw new NotFoundException('User not found.');}
    return find;
  }

//выход из акка если сменяется почта
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.update(+req.user.id, updateUserDto);
  }
//выход из акка если сменяется пароль
  @UseGuards(JwtAuthGuard)
  @Patch('me/updatePass')
  async updatePassword(@Request() req, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.updatePassword(+req.user.id, updateUserPasswordDto);
  }


  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Patch('me/updateEmail')
  async updateEmail(@Request() req, @Body() updateUserEmailDto: UpdateUserEmailDto) {
    const find = await this.userService.findById(+req.user.id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.updateEmail(+req.user.id, updateUserEmailDto);
  }

  //только админ
  @UseGuards(JwtAuthGuard)
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
