import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { SearchPersonDto } from './dto/search-person.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get('popular')
  getPopular() {
    return this.personService.getPopular();
  }

  @Get('search')
  search(@Query() searchPersonDto : SearchPersonDto){
    return this.personService.search(searchPersonDto);
  }

  @Get('painters')
  findPainters(){
    return this.personService.findPainters();
  }

  @Get('musicians')
  findMusicians(){
    return this.personService.findMusicians();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const find = await this.personService.findOne(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return find;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    const find = await this.personService.findOne(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return this.personService.update(+id, updatePersonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const find = await this.personService.findOne(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return this.personService.remove(+id);
  }
}
