import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config as awsConfig } from 'aws-sdk';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const configService: ConfigService = app.get(ConfigService);
  const config = new DocumentBuilder()
      .setTitle('ARTART REST API')
      .setDescription('ARTART API description')
      .setVersion('2.0')
      .addTag('Person', 'операции, связанные с деятелями искусства')
      .addTag('Art', 'операции, связанные с работами деятелей искусства')
      .addTag('Event', 'операции, связанные с мероприятиями')
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
