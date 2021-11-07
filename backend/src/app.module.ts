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
import { PaintingModule } from './painting/painting.module';
import { Painting } from './painting/entities/painting.entity';
import { MusicModule } from './music/music.module';
import { Music } from './music/entities/music.entity';
@Module({
  imports: [ TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 8000,
      username: 'artart',
      password: 'misteries',
      //extra: { trustServerCertificate: true },
      database: 'ArtArt',
      entities: [User, Person, Comment, Painting,Music],
      synchronize: true
  }),
  UserModule,
  PersonModule,
  CommentModule,
  AuthModule,
  PaintingModule,
  MusicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
