import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Request, Query, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserRole } from 'src/enums/role.enum';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

//ограничение на авторизованного пользователя
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }


//ограничение на авторизованного пользователя
  @Get('search')
  search(@Query() searchUserDto: SearchUserDto) {
    return this.userService.search(searchUserDto);
  }

//ограничение на авторизованного пользователя
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const {hash, role, updatedAt, email, ...find} = await this.userService.findById(+id);
    if (!find){throw new NotFoundException('User not found.');}
    return find;
  }

//выход из акка если сменяется почта
  //ЮЗЕР НЕ МОЖЕТ МЕНЯТЬ СВОЮ РОЛЬ (создать отдельно замену роли)
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
  /*
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const find = await this.userService.findById(+id);
    if (!find){throw new NotFoundException('User not found.');}
    return this.userService.remove(+id);
  }*/
}
