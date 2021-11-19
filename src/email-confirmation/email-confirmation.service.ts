import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
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
      private readonly userService: UserService,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService,
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
    return email;
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

    const text = `Welcome to the ARTART web-application. To confirm your email address, click here: ${url}`;
    const html = "<h3>Welcome to the ARTART web-application.</h3><h4></h4>" +
        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #00AAFF;  width: 220px; border-collapse: collapse;\">\n" +
        "<tbody>\n" +
        "<tr>\n" +
        "<td style=\"border-collapse: collapse; border-spacing: 0; font-family: ‘Trebuchet MS’, sans-serif; " +
        "font-size: 18px; text-align: center; color: #FFFFFF;  text-shadow: 1px 1px 0 #ff9444; border: 1px solid #00AAFF; padding: 13px;\">\n" +
        `<a href=\"${url}\" style=\"text-decoration: none; color: #FFFFFF;\" ` +
        "target=\"_self\">CONFIRM EMAIL</a></td>\n" +
        "</tbody>\n" +
        "</table>" +
        "<p style='font-size: 15px'>or click on this link:</p>" +
        `<a href=\"${url}\" >${url}</a>`

    return this.sendMail({
      to: email,
      subject: 'ARTART. Email confirmation | ARTART. Подтверждение Email ',
      text,
      html
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
