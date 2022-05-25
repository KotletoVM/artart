import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { CreateEmailConfirmationDto } from './dto/create-email-confirmation.dto';
import { UpdateEmailConfirmationDto } from './dto/update-email-confirmation.dto';
import ConfirmEmailDto from './dto/confirmEmail.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiCreatedResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientErrorResponseSchema } from 'src/schemas/client-error-response.schema';

@ApiTags('Email confirmation')
@Controller('api/email')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @ApiCreatedResponse({
    status: 201,
    description: 'Email confirmed',
    schema: {
      type: 'string'
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad confirmation token / Email confirmation token expired / Email already confirmed',
    type: ClientErrorResponseSchema
  })
  @Post('confirm')
  async confirm(@Query('token') confirmEmailDto: string) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(confirmEmailDto);
    return await this.emailConfirmationService.confirmEmail(email);
  }

  @ApiCreatedResponse({
    status: 201,
    description: 'New confirmation link sent'
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Email already confirmed',
    type: ClientErrorResponseSchema
  })
  @ApiBearerAuth('jwt-access-user')
  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() req) {
    return await this.emailConfirmationService.resendConfirmationLink(req.user.id);
  }
}
