import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Query, Request, ForbiddenException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EmailConfirmationGuard } from 'src/auth/guards/emailConfirmation.guard';
import { UserRole } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Post()
  create(@Request() req, @Body() createCommentDto: CreateCommentDto, @Query('personid') personid: number) {
    return this.commentService.create(createCommentDto, req.user.id, personid);
  }

  @Get()
  findAllforPerson(@Query('personid') personid: number, @Query('take') take: number, @Query('skip') skip: number) {
    return this.commentService.findAllforPerson(personid, take, skip);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.commentService.findAll(take, skip);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found.');}
    return this.commentService.findOne(+id);
  }


  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found.');}
    else if (find.user.id != req.user.id){throw new ForbiddenException('Its not your comment');}
    return this.commentService.update(+id, updateCommentDto);
  }

  //СДЕЛАТЬ ВОЗМОЖНОСТЬ ДЛЯ АДМИНОВ УДАЛЯТЬ КОММЕНТЫ
  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found.');}
    else if (find.user.id != req.user.id){throw new ForbiddenException('Its not your comment');}
    return this.commentService.remove(+id);
  }

  /*@UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeAdm(@Param('id') id: string, @Request() req) {
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found.');}
    else if (find.user.id != req.user.id){throw new ForbiddenException('Its not your comment');}
    return this.commentService.remove(+id);
  }*/
}