import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';

@ApiTags('Tag')
@Controller('api/tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOkResponse({
    status: 200,
    description: 'Tags received',
    type: CreateTagDto,
    isArray: true
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Validation failed',
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Tags not found',
    type: ClientErrorResponseSchema
  })
  @Get()
  findAll(@Query('personid') personid: number) {
    if (!+personid) throw new BadRequestException('Person\'s id must be specified as number')
    return this.tagService.findPersonTags(personid);
  }
}
