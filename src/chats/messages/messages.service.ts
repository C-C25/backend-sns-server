import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesModel } from './entities/messages.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-messages.dto';
import { PaginateMessageDto } from './dto/paginate-message.dto';
import { CommonService } from '../../common/common.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepo: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  paginateMessage(
    dto: PaginateMessageDto,
    overrideFindOptions: FindManyOptions<MessagesModel>,
  ) {
    return this.commonService.paginate(
      dto,
      this.messagesRepo,
      overrideFindOptions,
      'messages',
    );
  }

  async createMessages(dto: CreateMessageDto, authorId: number) {
    const message = await this.messagesRepo.save({
      chat: {
        id: dto.chatId,
      },
      author: {
        id: authorId,
      },
      message: dto.message,
    });

    return this.messagesRepo.findOne({
      where: {
        id: message.id,
      },
      relations: {
        chat: true,
      },
    });
  }
}
