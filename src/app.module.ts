import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from './user/entities/user.entity';
import { PersonModule } from './person/person.module';
import { Person } from './person/entities/person.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { ArtModule } from './art/art.module';
import { Art } from './art/entities/art.entity';
import { Event } from './event/entities/event.entity';
import { EventModule } from './event/event.module';
import { TagModule } from './tag/tag.module';
import { Tag } from './tag/entities/tag.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config/configuration';
import { DatabaseConfig } from './config/database.config';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { FileModule } from './file/file.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { TokenModule } from './jwt/jwt.module';


@Module({
  imports: [ ConfigModule.forRoot({isGlobal: true, load: [config]}),
      /*TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 8000,
      username: 'artart',
      password: 'misteries',
      //extra: { trustServerCertificate: true },
      database: 'ArtArt',
      entities: [User, Person, Comment, Art,Music, Event, Tag],
      synchronize: true
  }),*/
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: DatabaseConfig,
      }),
  UserModule,
  PersonModule,
  CommentModule,
  AuthModule,
  ArtModule,
  EventModule,
  TagModule,
  EmailConfirmationModule,
  FileModule,
  ResetPasswordModule,
  TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    constructor(private configService: ConfigService) {
    }


}
