import { Controller, Get, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { PaginateChatDto } from './dto/pagination-chats.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  paginateChat(@Query() dto: PaginateChatDto) {
    return this.chatsService.paginateChats(dto);
  }
}
