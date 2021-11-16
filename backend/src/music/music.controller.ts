import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  //ограничение на админа
  //возможность сделать/изменить/удалить музыку со странички персоны
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createMusicDto: CreateMusicDto) {
    return this.musicService.create(createMusicDto);
  }

  @Get()
  findAllforPerson(@Query('personid') personid: number) {
    return this.musicService.findAllforPerson(+personid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(+id);
  }

  //ограничение на админа
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.update(+id, updateMusicDto);
  }

  //ограничение на админа
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicService.remove(+id);
  }
}
