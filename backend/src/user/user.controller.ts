import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Request, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }



  @Get('search')
  search(@Query() searchUserDto: SearchUserDto) {
    return this.userService.search(searchUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const find = await this.userService.findById(+id);
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
