import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ArtService } from './art.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('art')
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  //ограничение на админа
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createArtDto: CreateArtDto) {
    return this.artService.create(createArtDto);
  }

  //добавить @Get() с выводом запрета при попытке получить все арты

  @Get()
  findAllforPerson(@Query('personid') personid: string) {
    return this.artService.findAllforPerson(+personid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artService.findOne(+id);
  }

  //ограничение на админа
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtDto: UpdateArtDto) {
    return this.artService.update(+id, updateArtDto);
  }

  //ограничение на админа
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artService.remove(+id);
  }
}
