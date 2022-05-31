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
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: "GET,PATCH,POST,DELETE,UPDATE,OPTIONS",
    credentials: true,
  });
  const configService: ConfigService = app.get(ConfigService);
  const config = new DocumentBuilder()
      .setTitle('ARTART REST API')
      .setDescription('ARTART API description')
      .setVersion('2.0')
      .addTag('Auth', 'операции, связанные с аутентификацией')
      .addTag('Email confirmation', 'операции, связанные с подтверждением почты')
      .addTag('User', 'операции, связанные с пользователями')
      .addTag('Person', 'операции, связанные с деятелями искусства')
      .addTag('Art', 'операции, связанные с работами деятелей искусства')
      .addTag('Comment', 'операции, связанные с комментариями')
      .addTag('Event', 'операции, связанные с мероприятиями')
      .addTag('Default')
      .addBearerAuth({type: 'http', description: 'Авторизация для аутентифицированных пользователей.', bearerFormat: 'JWT'}, 'jwt-access-user')
      .addBearerAuth({type: 'http', description: 'Обновление токена доступа', bearerFormat: 'JWT'}, 'jwt-refresh-user')
      .addBasicAuth({type: 'http', scheme: 'Basic', description: 'Аутентификация пользователей по email и паролю.'}, 'local-user')
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
