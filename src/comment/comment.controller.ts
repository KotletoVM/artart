import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Query, Request, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EmailConfirmationGuard } from 'src/auth/guards/emailConfirmation.guard';
import { UserRole } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';
import { CommentResponse } from 'src/schemas/comment-response.schema';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiCreatedResponse({
    status: 201,
    description: 'Comment created',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        text: {
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
    description: "Person not found",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Post()
  create(@Request() req, @Body() createCommentDto: CreateCommentDto, @Query('personid') personid: number) {
    if (!+personid) throw new BadRequestException('Person\'s id must be specified as number')
    return this.commentService.create(createCommentDto, req.user.id, personid);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Comments received',
    schema: {
      type: 'object',
      properties: {
        comments: {
          type: 'array',
          items: {
            type: 'object',
            properties: CommentResponse
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
    description: "Comments not found",
    type: ClientErrorResponseSchema
  })
  @Get()
  findAllforPerson(@Query('personid') personid: number, @Query('take') take: number, @Query('skip') skip: number) {
    if (!+personid) throw new BadRequestException('Person\'s id must be specified as number')
    if ((take && !+take) || (skip && !+skip)) throw new BadRequestException('Query parameters must be specified as numbers')
    return this.commentService.findAllforPerson(personid, take, skip);
  }

  /*@Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    return this.commentService.findAll(take, skip);
  }*/

  @ApiOkResponse({
    status: 200,
    description: 'Comment received',
    schema: {
      type: 'object',
      properties: CommentResponse
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 401,
    description: "Comment not found",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Id must be specified as number')
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found');}
    return find
  }

  @ApiOkResponse({
    status: 200,
    description: 'Comment updated',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        text: {
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
    description: "Comment not found",
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 401,
    description: "Current user and comment\'s author are not equal",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    if (!+id) throw new BadRequestException('Id must be specified as number')
    const find = await this.commentService.findOne(+id);
    if (!find){throw new NotFoundException('Comment not found');}
    else if (find.user.id != req.user.id){throw new ForbiddenException('Its not your comment');}
    return this.commentService.update(+id, updateCommentDto);
  }

  //СДЕЛАТЬ ВОЗМОЖНОСТЬ ДЛЯ АДМИНОВ УДАЛЯТЬ КОММЕНТЫ
  @ApiOkResponse({
    status: 200,
    description: 'Comment deleted',
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
    description: "Comment not found",
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 401,
    description: "Current user and comment\'s author are not equal",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @UseGuards(JwtAuthGuard, EmailConfirmationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    if (!+id) throw new BadRequestException('Id must be specified as number')
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
