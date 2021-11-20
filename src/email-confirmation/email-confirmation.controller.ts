import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { CreateEmailConfirmationDto } from './dto/create-email-confirmation.dto';
import { UpdateEmailConfirmationDto } from './dto/update-email-confirmation.dto';
import ConfirmEmailDto from './dto/confirmEmail.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('email_confirmation')
@Controller('email')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Post('confirm')
  async confirm(@Query('token') confirmEmailDto: string) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(confirmEmailDto);
    return await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() req) {
    await this.emailConfirmationService.resendConfirmationLink(req.user.id);
  }
}
