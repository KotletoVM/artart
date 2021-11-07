import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaintingService } from './painting.service';
import { CreatePaintingDto } from './dto/create-painting.dto';
import { UpdatePaintingDto } from './dto/update-painting.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('painting')
export class PaintingController {
  constructor(private readonly paintingService: PaintingService) {}

  //ограничение на админа
  //возможность сделать/изменить/удалить картину со странички персоны
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPaintingDto: CreatePaintingDto) {
    return this.paintingService.create(createPaintingDto);
  }

  @Get()
  findAllforPerson(@Query('personid') personid: number) {
    return this.paintingService.findAllforPerson(+personid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paintingService.findOne(+id);
  }

  //ограничение на админа
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaintingDto: UpdatePaintingDto) {
    return this.paintingService.update(+id, updatePaintingDto);
  }

  //ограничение на админа
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paintingService.remove(+id);
  }
}
