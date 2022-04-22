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
import { ApiQuery, ApiTags, ApiBearerAuth, ApiForbiddenResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiOkResponse, ApiBadRequestResponse, ApiConsumes, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SortDto } from './dto/sort.dto';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';
import { PersonResponse } from 'src/schemas/person-response.schema';

@ApiTags('Person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @ApiCreatedResponse({
    status: 201,
    description: 'Person created',
    type: CreatePersonDto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 403,
    description: "<p>Forbidden resource, only Admin can create new Person</p><img src='https://memepedia.ru/wp-content/uploads/2019/02/obladaet-mem-4.jpg' width='140px'/>",
    type: ClientErrorResponseSchema
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @ApiCreatedResponse({
    status: 201,
    description: 'Person liked/disliked',
    schema: {
      type: 'object',
      properties: {
        'likes': {
          type: 'integer'
        },
        'liked': {
          type: 'boolean'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "Person not found",
    type: ClientErrorResponseSchema
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Post('like')
  async setLike(@Request() req, @Query('personid') personid: number){
    return this.personService.setLike(req.user.id, +personid);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Persons received',
    schema: {
      type: 'object',
      properties: {
        persons: {
          type: 'array',
          items: {
            type: 'object',
            properties: PersonResponse
          }
        },
        count: {
          type: 'integer'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() sortDto: SortDto, @Request() req: Req) {
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
  @ApiOkResponse({
    status: 200,
    description: 'Persons received',
    schema: {
      type: 'object',
      properties: {
        persons: {
          type: 'array',
          items: {
            type: 'object',
            properties: PersonResponse
          }
        },
        count: {
          type: 'integer'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiQuery({
    name: 'take',
    type: 'number',
    required: false
  })
  @ApiQuery({
    name: 'skip',
    type: 'number',
    required: false
  })
  @Get('search')
  //@UsePipes(new ValidationPipe({ transform: true }))
  search(@Query() searchPersonDto : SearchPersonDto, @Query('take') take: number, @Query('skip') skip: number){
    if ((take && !+take) || (skip && !+skip)) throw new BadRequestException('Query parameters must be specified as numbers')
    return this.personService.search(searchPersonDto, take, skip);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Persons received',
    schema: {
      type: 'object',
      properties: {
        persons: {
          type: 'array',
          items: {
            type: 'object',
            properties: PersonResponse
          }
        },
        count: {
          type: 'integer'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiQuery({
    name: 'take',
    type: 'number',
    required: false
  })
  @ApiQuery({
    name: 'skip',
    type: 'number',
    required: false
  })
  @Get('tags')
  async findByTag(@Query('tag') tagid: number, @Query('take') take: number, @Query('skip') skip: number, @Request() req: Req){
    if (!+tagid){throw new BadRequestException('Id must be a number.')}
    if ((take && !+take) || (skip && !+skip)) throw new BadRequestException('Query parameters must be specified as numbers')
    return this.personService.findByTag(req, tagid, take, skip);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Favorite persons received',
    schema: {
      type: 'object',
      properties: {
        persons: {
          type: 'array',
          items: {
            type: 'object',
            properties: PersonResponse
          }
        },
        count: {
          type: 'integer'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiQuery({
    name: 'take',
    type: 'number',
    required: false
  })
  @ApiQuery({
    name: 'skip',
    type: 'number',
    required: false
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, /*EmailConfirmationGuard*/)
  @Get('favorite')
  async findUsersFavorite(@Request() req, @Query('take') take: number, @Query('skip') skip: number){
    if ((take && !+take) || (skip && !+skip)) throw new BadRequestException('Query parameters must be specified as numbers')
    return this.personService.findUsersFavorite(req.user.id, take, skip);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Person\'s social networks received',
    schema: {
      type: 'object',
      properties: {
        instagram: {
          type: 'string',
          additionalProperties: true
        },
        vk: {
          type: 'string',
          additionalProperties: true
        },
        tg: {
          type: 'string',
          additionalProperties: true
        },
        spotify: {
          type: 'string',
          additionalProperties: true
        },
        site: {
          type: 'string',
          additionalProperties: true
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: "Person not found",
    type: ClientErrorResponseSchema
  })
  @Get('soc')
  async getSoc(@Query('personid') personid: number, @Request() req: Req) {
    if (!+personid){throw new BadRequestException('Person d must be a number.')}
    const find = await this.personService.findOneSimple(personid);
    if (!find){throw new NotFoundException('Person not found.');}
    return await this.personService.getSoc(personid);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Person received',
    schema: {
      type: 'object',
      properties: {
        persons: {
          type: 'array',
          items: {
            type: 'object',
            properties: PersonResponse
          }
        },
        count: {
          type: 'integer'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 401,
    description: "Person not found",
    type: ClientErrorResponseSchema
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: Req) {
    if (!+id){throw new BadRequestException('Id must be a number.')}
    return this.personService.findOne(req, +id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        "file": {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiOkResponse({
    status: 200,
    description: 'Person\'s userpic updated',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        },
        "url": {
          type: 'string'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Person not found',
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 403,
    description: "Forbidden resource, only Admin can update Person",
    type: ClientErrorResponseSchema
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize again",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('updatePersonpic')
  async updatePersonpic(@Query('personid') personid: number, @UploadedFile() personpic?: Express.Multer.File) {
    if (personpic){
      if (personpic.mimetype != 'image/jpeg' && personpic.mimetype != 'image/png'){
        throw new BadRequestException('Userpic must be image (jpg, jpeg or png).')
      }
      if (personpic.size >= 5000000){
        throw new BadRequestException('Userpic size must be less then 5 Mb.');
      }
      return this.personService.updatePersonpic(personid, personpic);
    }
    throw new BadRequestException('To update personpic upload new personpic first.');
  }

  @ApiOkResponse({
    status: 200,
    description: 'Person\'s information updated',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Person not found',
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 403,
    description: "Forbidden resource, only Admin can update Person",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    if (!+id){throw new BadRequestException('Id must be a number.')}
    const find = await this.personService.findOneSimple(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return this.personService.update(+id, updatePersonDto);
  }

  //ограничение на админа
  @ApiOkResponse({
    status: 200,
    description: 'Person deleted',
    schema: {
      type: 'object',
      properties: {
        "message": {
          type: 'string'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Person not found',
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 403,
    description: "Forbidden resource, only Admin can delete Person",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!+id){throw new BadRequestException('Id must be a number.')}
    const find = await this.personService.findOneSimple(+id);
    if (!find){throw new NotFoundException('Person not found.');}
    return this.personService.remove(+id);
  }

}
