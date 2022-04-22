import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBearerAuth, ApiOkResponse, ApiForbiddenResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';
import { EventResponse } from 'src/schemas/event-response.schema';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiCreatedResponse({
    status: 201,
    description: 'Event created',
    type: CreateEventDto
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
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Events received',
    schema: {
      type: 'object',
      properties: {
        events: {
          type: 'array',
          items: {
            type: 'object',
            properties: EventResponse
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
    description: "Events not found",
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
  @Get()
  findAll(@Query('take') take: number, @Query('skip') skip: number) {
    if ((take && !+take) || (skip && !+skip)) throw new BadRequestException('Query parameters must be specified as numbers')
    return this.eventService.findAll(take, skip);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Event received',
    schema: {
      type: 'object',
      properties: EventResponse
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Validation failed",
    type: ClientErrorResponseSchema
  })
  @ApiNotFoundResponse({
    status: 401,
    description: "Event not found",
    type: ClientErrorResponseSchema
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Id must be number')
    return this.eventService.findOne(+id);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Event updated',
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
    description: "Event not found",
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 401,
    description: "Only admin can update event",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    if (!+id) throw new BadRequestException('Id must be number')
    return this.eventService.update(+id, updateEventDto);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Event deleted',
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
    description: "Event not found",
    type: ClientErrorResponseSchema
  })
  @ApiForbiddenResponse({
    status: 401,
    description: "Only admin can delete event",
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Id must be number')
    return this.eventService.remove(+id);
  }
}
