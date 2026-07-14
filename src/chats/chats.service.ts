import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsModel } from './entities/chats.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { PaginateChatDto } from './dto/pagination-chats.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsModel)
    private readonly chatsRepo: Repository<ChatsModel>,
    private readonly commonService: CommonService,
  ) {}

  paginateChats(dto: PaginateChatDto) {
    return this.commonService.paginate(
      dto,
      this.chatsRepo,
      {
        relations: {
          users: true,
        },
      },
      'chats',
    );
  }

  async createChats(dto: CreateChatDto) {
    const chat = await this.chatsRepo.save({
      users: dto.userIds.map((id) => ({ id })),
    });

    return this.chatsRepo.findOne({
      where: {
        id: chat.id,
      },
    });
  }

  async checkIfChatExists(chatId: number) {
    const chat = await this.chatsRepo.exists({
      where: {
        id: chatId,
      },
    });

    return chat;
  }
}
