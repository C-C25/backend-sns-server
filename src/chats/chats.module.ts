import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModel } from './entities/chats.entity';
import { CommonModule } from '../common/common.module';
import { MessagesModel } from './messages/entities/messages.entity';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { ChatsGateway } from './chats.gateway';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatsModel, MessagesModel]),
    CommonModule,
    AuthModule,
  ],
  exports: [ChatsService],
  controllers: [ChatsController, MessagesController],
  providers: [ChatsGateway, ChatsService, MessagesService],
})
export class ChatsModule {}
