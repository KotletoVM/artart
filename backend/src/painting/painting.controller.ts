import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaintingService } from './painting.service';
import { CreatePaintingDto } from './dto/create-painting.dto';
import { UpdatePaintingDto } from './dto/update-painting.dto';

@Controller('painting')
export class PaintingController {
  constructor(private readonly paintingService: PaintingService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaintingDto: UpdatePaintingDto) {
    return this.paintingService.update(+id, updatePaintingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paintingService.remove(+id);
  }
}
