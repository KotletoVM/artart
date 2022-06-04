import { Controller, Post, Query, BadRequestException } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@ApiExcludeController()
@Controller('api/email')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService,
              private readonly userService: UserService) {}

  @Post('confirm')
  async confirm(@Query('token') token: string) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(token);
    const user = await this.userService.findByEmail(email);
    if (user.isEmailConfirmed) throw new BadRequestException('Email already confirmed');
    return await this.userService.markEmailAsConfirmed(email);
  }

  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Query('token') token: string) {
    //return await this.emailConfirmationService.resendConfirmationLink(req.user.id);
  }
}
