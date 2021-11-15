import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Query, Request, ForbiddenException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  //создание и просмотр комментов только на странице конкретной персоны
  //инструмент для админа - все комменты одного пользователя

  //✔ - доделать отправку комментария от лица только текущего юзера
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createCommentDto: CreateCommentDto, @Query('personid') personid: number) {
    return this.commentService.create(createCommentDto, req.user.id, personid);
  }

  //ограничение на админа (интерфейс для подчистки гадких комментов,
  // поэтому выводятся сразу все из всех персон)


  @Get()
  findAllforPerson(@Query('personid') personid: number) {
    return this.commentService.findAllforPerson(personid);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  //ограничение на админа
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found.');}
    return this.commentService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found.');}
    else if (find.user.id != req.user.id){throw new ForbiddenException('Its not your comment');}
    return this.commentService.update(+id, updateCommentDto);
  }

  //СДЕЛАТЬ ВОЗМОЖНОСТЬ ДЛЯ АДМИНОВ УДАЛЯТЬ КОММЕНТЫ
  @UseGuards(JwtAuthGuard)
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
