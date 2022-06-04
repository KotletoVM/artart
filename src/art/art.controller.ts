import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ArtService } from './art.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiTags, ApiForbiddenResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiBearerAuth, ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';
import { ArtResponce } from 'src/schemas/art-response.schema';

@ApiTags('Art')
@Controller('api/art')
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  @ApiExcludeEndpoint()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createArtDto: CreateArtDto) {
    return this.artService.create(createArtDto);
  }

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

  @ApiExcludeEndpoint()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtDto: UpdateArtDto) {
    if (!+id) throw new BadRequestException('Id must be specified as number')
    return this.artService.update(+id, updateArtDto);
  }

  @ApiExcludeEndpoint()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Id must be specified as number')
    return this.artService.remove(+id);
  }
}
