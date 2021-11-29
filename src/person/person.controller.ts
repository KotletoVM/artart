import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, UseGuards, Request, UseInterceptors, UploadedFile, ForbiddenException, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { SearchPersonDto } from './dto/search-person.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request as Req} from 'express';
import { EmailConfirmationGuard } from 'src/auth/guards/emailConfirmation.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SortDto } from './dto/sort.dto';

@ApiTags('person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }


  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Post('like')
  async setLike(@Request() req, @Query('personid') personid: number){
    return this.personService.setLike(req.user.id, personid);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Request() req: Req, @Query() sortDto: SortDto) {
    return this.personService.findAll(req, sortDto);
  }
/*
  @Get('popular')
  getPopular(@Request() req: Req, @Body() sortDto: SortDto) {
    return this.personService.getPopular(req, sortDto);
  }

  @Get('alphabet')
  getByAlphabet(@Request() req: Req, @Body() sortDto: SortDto) {
    return this.personService.getByAlphabet(req, sortDto);
  }
*/
  @Get('search')
  search(@Query() searchPersonDto : SearchPersonDto, @Query('take') take: number, @Query('skip') skip: number){
    return this.personService.search(searchPersonDto, take, skip);
  }

  @Get('tags')
  async findByTag(@Query('tag') tagid: number, @Query('take') take: number, @Query('skip') skip: number, @Request() req: Req){
    return this.personService.findByTag(req, tagid, take, skip);
  }

  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Get('favorite')
  async findUsersFavorite(@Request() req, @Query('take') take: number, @Query('skip') skip: number){
    return this.personService.findUsersFavorite(req.user.id, take, skip);
  }

  @Get('soc')
  async getSoc(@Query('personid') personid: number, @Request() req: Req) {
    const find = await this.personService.findOneSimple(personid);
    if (!find){throw new NotFoundException('Person not found.');}
    return await this.personService.getSoc(personid);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: Req) {
    if (!+id){throw new BadRequestException('Id must be a number.')}
    const find = await this.personService.findOne(req, +id);
    if (!find){throw new NotFoundException('Person not found.');}
    return find;
  }



  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('updatePersonpic')
  async updatePersonpic(@Query('personid') personid: number, @UploadedFile() personpic?: Express.Multer.File) {
    if (personpic){
      if (personpic.mimetype != 'image/jpeg' && personpic.mimetype != 'image/png'){
        throw new ForbiddenException('Userpic must be image (jpg, jpeg or png).')
      }
      if (personpic.size >= 5000000){
        throw new ForbiddenException('Userpic size must be less then 5 Mb.');
      }
      return this.personService.updatePersonpic(personid, personpic);
    }
    throw new ForbiddenException('To update personpic upload new personpic first.');
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    const find = await this.personService.findOneSimple(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return this.personService.update(+id, updatePersonDto);
  }

  //ограничение на админа
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const find = await this.personService.findOneSimple(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return this.personService.remove(+id);
  }

}
