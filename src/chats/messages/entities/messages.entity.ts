import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../common/entities/base.entity';
import { ChatsModel } from '../../entities/chats.entity';
import { UsersModel } from '../../../users/entities/user.entity';
import { IsString } from 'class-validator';

@Entity()
export class MessagesModel extends BaseModel {
  @ManyToOne(() => ChatsModel, (chat) => chat.messages)
  chat!: ChatsModel;

  @ManyToOne(() => UsersModel, (user) => user.messages)
  author!: UsersModel;

  @Column({ type: 'varchar' })
  @IsString()
  message!: string;
}
