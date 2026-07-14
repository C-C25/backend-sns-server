import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PaginateMessageDto } from './dto/paginate-message.dto';

@Controller('messages/:cid/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  paginateMEssage(
    @Param('cid', ParseIntPipe) id: number,
    @Query() dto: PaginateMessageDto,
  ) {
    return this.messagesService.paginateMessage(dto, {
      where: {
        chat: {
          id,
        },
      },
      relations: {
        author: true,
        chat: true,
      },
    });
  }
}
