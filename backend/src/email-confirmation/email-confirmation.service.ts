import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateEmailConfirmationDto } from './dto/create-email-confirmation.dto';
import { UpdateEmailConfirmationDto } from './dto/update-email-confirmation.dto';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailConfirmationService {
  private nodemailerTransport: Mail;

  constructor(
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService,
      private readonly userService: UserService
  ) {
    this.nodemailerTransport = createTransport({
      service: configService.get('email.service'),
      auth: {
        user: configService.get('email.user'),
        pass: configService.get('email.password'),
      }
    });
  }

  public async confirmEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.userService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('verification.secret'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException('there is no email in JWT');
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  public sendVerificationLink(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('verification.secret'),
      expiresIn: this.configService.get('verification.expiresIn')
    });

    const url = `${this.configService.get('verification.url')}?token=${token}`;

    const text = `Welcome to the ARTART web-application. To confirm the email address, click here: ${url}`;

    return this.sendMail({
      to: email,
      subject: 'ARTART. Email confirmation | ARTART. Подтверждение Email ',
      text,
    })
  }

  public async resendConfirmationLink(userId: number) {
    const user = await this.userService.findById(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }
}
