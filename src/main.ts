import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config as awsConfig } from 'aws-sdk';
import {cors} from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(/*secret дописать*/));
  app.use(cors({
    origin: `http://localhost:3000`,  //react's address
    credentials: true
  }));
  const configService: ConfigService = app.get(ConfigService);
  const config = new DocumentBuilder()
      .setTitle('ARTART')
      .setDescription('ARTART API description')
      .setVersion('1.0')
      .addTag('auth', 'операции, связанные с аутентификацией')
      .addTag('email_confirmation', 'операции, связанные с подтверждением почты')
      .addTag('user', 'операции, связанные с пользователями')
      .addTag('person', 'операции, связанные с деятелями искусства')
      .addTag('art', 'операции, связанные с работами деятелей искусства')
      .addTag('comment', 'операции, связанные с комментариями')
      .addTag('event', 'операции, связанные с мероприятиями')
      .build();
  awsConfig.update({
    accessKeyId: configService.get('awsConfig.accessKey'),
    secretAccessKey: configService.get('awsConfig.secretAccessKey'),
    region: configService.get('awsConfig.region')
  })
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('PORT') || 8080);
}
bootstrap();
