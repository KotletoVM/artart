import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Query, Request } from '@nestjs/common';
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
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto, req.user.id);
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

  //возможность редактировать только свои комменты
  // (админы НЕ МОГУТ редактировать чужие комменты)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found.');}
    return this.commentService.update(+id, updateCommentDto);
  }

  //возможность удалять только свои комменты
  // (админы МОГУТ И ИМЕЮТ ПРАВО удалять чужие гадкие комменты)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found.');}
    return this.commentService.remove(+id);
  }
}
