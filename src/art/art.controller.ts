import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ArtService } from './art.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiTags, ApiForbiddenResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBearerAuth, ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';
import { ArtResponce } from 'src/schemas/art-response.schema';

@ApiTags('Art')
@Controller('api/art')
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  //ограничение на админа
  @ApiCreatedResponse({
    status: 201,
    description: 'Art created',
    type: CreateArtDto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize",
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 403,
    description: "Forbidden resource, only admin can create new art",
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
  create(@Body() createArtDto: CreateArtDto) {
    return this.artService.create(createArtDto);
  }

  //добавить @Get() с выводом запрета при попытке получить все арты

  @ApiOkResponse({
    status: 200,
    description: 'Art received',
    schema: {
      type: 'object',
      properties: {
        arts: {
          type: 'array',
          items: {
            type: 'object',
            properties: ArtResponce
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
  @Get()
  findAllforPerson(@Query('personid') personid: string) {
    if (!+personid) throw new BadRequestException('Person\'s id must be specified as number')
    return this.artService.findAllforPerson(+personid);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Art received',
    schema: {
      type: 'object',
      properties: ArtResponce
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 401,
    description: "Art not found",
    type: ClientErrorResponseSchema
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Id must be specified as number')
    return this.artService.findOne(+id);
  }

  //ограничение на админа
  @ApiOkResponse({
    status: 200,
    description: 'Art updated',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize",
    type: ClientErrorResponseSchema
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 401,
    description: "Art not found",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtDto: UpdateArtDto) {
    if (!+id) throw new BadRequestException('Id must be specified as number')
    return this.artService.update(+id, updateArtDto);
  }

  //ограничение на админа
  @ApiOkResponse({
    status: 200,
    description: 'Art deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "User should authorize",
    type: ClientErrorResponseSchema
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 401,
    description: "Art not found",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Id must be specified as number')
    return this.artService.remove(+id);
  }
}
