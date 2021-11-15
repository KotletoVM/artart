import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, UseGuards, Request } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { SearchPersonDto } from './dto/search-person.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as Req} from 'express';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  //ограничение на админа
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }


  @Get()
  async findAll(@Request() req: Req) {
    return this.personService.findAll(req);
  }

  @Get('popular')
  getPopular(@Request() req: Req) {
    return this.personService.getPopular(req);
  }

  @Get('search')
  search(@Query() searchPersonDto : SearchPersonDto){
    return this.personService.search(searchPersonDto);
  }

  @Get('tags')
  async findByTag(@Query('tag') tagid: number, @Request() req: Req){
    return this.personService.findByTag(req, tagid);
  }

  @Get('artists')
  findArtists(){
    return this.personService.findArtists();
  }

  @Get('musicians')
  findMusicians(){
    return this.personService.findMusicians();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: Req) {
    const find = await this.personService.findOne(req, +id);
    if (!find){throw new NotFoundException('Person not found.');}
    return find;
  }

  //ограничение на админа
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    const find = await this.personService.findOneSimple(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return this.personService.update(+id, updatePersonDto);
  }

  //ограничение на админа
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const find = await this.personService.findOneSimple(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return this.personService.remove(+id);
  }
}
