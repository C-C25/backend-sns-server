import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_NAME_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
} from './common/const/keys-values.const';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { UsersModel } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PostsModule } from './posts/posts.module';
import { PostsModel } from './posts/entities/post.entity';
import { ChatsModule } from './chats/chats.module';
import { ChatsModel } from './chats/entities/chats.entity';
import { MessagesModel } from './chats/messages/entities/messages.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]!),
      username: process.env[ENV_DB_NAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [UsersModel, PostsModel, ChatsModel, ChatsModel, MessagesModel],
      synchronize: true,
    }),
    UsersModule,
    CommonModule,
    AuthModule,
    PostsModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
