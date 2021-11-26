import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(@Query('personid') personid: number) {
    return this.tagService.findPersonTags(personid);
  }
}
