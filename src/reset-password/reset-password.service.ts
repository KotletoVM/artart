import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ResetPasswordService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService,
              private readonly jwtService: JwtService,) {
    this.nodemailerTransport = createTransport({
      service: configService.get('email.service'),
      host: "smtp.yandex.ru",
      auth: {
        user: configService.get('email.user'),
        pass: configService.get('email.password'),
      }
    });
  }

  sendResetLink(email: string){
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('password_reset.secret'),
      expiresIn: this.configService.get('password_reset.expiresIn')
    });

    const url = `${this.configService.get('password_reset.url')}/${token}`;

    const text = `Welcome to the ARTART web-application. To reset your password, click here: ${url}`;
    const html = "<h3>Welcome to the ARTART web-application.</h3><h4></h4>" +
        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #FF4444;  width: 220px; border-collapse: collapse;\">\n" +
        "<tbody>\n" +
        "<tr>\n" +
        "<td style=\"border-collapse: collapse; border-spacing: 0; font-family: ‘Trebuchet MS’, sans-serif; " +
        "font-size: 18px; text-align: center; color: #FFFFFF;  text-shadow: 1px 1px 0 #ff9444; border: 1px solid #FF4444; padding: 13px;\">\n" +
        `<a href=\"${url}\" style=\"text-decoration: none; color: #FFFFFF;\" ` +
        "target=\"_self\">RESET PASSWORD</a></td>\n" +
        "</tbody>\n" +
        "</table>" +
        "<p style='font-size: 15px'>or click on this link:</p>" +
        `<a href=\"${url}\" >${url}</a>`

    return this.sendMail({
      from: this.configService.get('email.user'),
      to: email,
      subject: 'ARTART. Password Reset | ARTART. Сброс пароля ',
      text,
      html
    }).then(emailResult => {
      return {message: "Password reset email sent", emailId: emailResult.messageId}
    }).catch(err => {throw new BadRequestException('Something went wrong. Email not sent')})
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('password_reset.secret'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException('there is no email in JWT');
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Password reset token expired');
      }
      throw new BadRequestException('Bad password reset token');
    }
  }
}
