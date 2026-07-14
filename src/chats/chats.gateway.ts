import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersModel } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessageDto } from './messages/dto/create-messages.dto';
import { MessagesService } from './messages/messages.service';
import { JwtPayload } from '../auth/jwt/jwt-payload.interface';

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(ChatsGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @WebSocketServer()
  server!: Server;

  afterInit(server: any) {
    this.logger.log('after gateway init');
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`on disconnect called: ${socket.id}`);
  }

  async handleConnection(socket: Socket & { user: JwtPayload }) {
    this.logger.log(`on connect called: ${socket.id}`);

    const headers = socket.handshake.headers;

    const rawToken = headers.authorization;

    if (!rawToken) {
      socket.disconnect(); // 토큰이 없으면 바로 끊는다.
      return;
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      const payload = this.authService.verifyAccessToken(token);

      socket.user = payload;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);

      this.logger.log(`WebSocket 인증 실패: ${message}`);
      socket.disconnect();
    }
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @SubscribeMessage('create_chat') // 룸 생성,
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: JwtPayload },
  ) {
    const chat = await this.chatsService.createChats(data);

    return chat;
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @SubscribeMessage('enter_chat') // 채팅방 ID들을 리스트로 받아야 된다.
  async enterChat(
    @ConnectedSocket() socket: Socket & { user: JwtPayload },
    @MessageBody() data: EnterChatDto,
  ) {
    for (const chatId of data.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists) {
        throw new WsException({
          code: 100,
          message: `삭제되었거나 존재하지 않는 방입니다.`,
        });
      }
    }

    socket.join(data.chatIds.map((x) => x.toString()));
    this.logger.log(`socket ${socket.id} joined rooms:, ${data.chatIds}`);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @SubscribeMessage('send_message') // 보내는 메세지
  async sendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() socket: Socket & { user: JwtPayload },
  ) {
    const chatExists = await this.chatsService.checkIfChatExists(data.chatId);

    if (!chatExists) {
      throw new WsException(`삭제되었거나 존재하지 않는 방입니다.`);
    }

    const message = await this.messagesService.createMessages(
      data,
      socket.user.sub,
    );

    socket
      .to(message?.chat.id.toString()!)
      .emit('receive_message', message?.message);
  }
}
