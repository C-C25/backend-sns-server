import { Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { UsersModel } from '../../users/entities/user.entity';
import { MessagesModel } from '../messages/entities/messages.entity';

@Entity()
export class ChatsModel extends BaseModel {
  @ManyToMany(() => UsersModel, (user) => user.chats)
  users!: UsersModel[];

  @OneToMany(() => MessagesModel, (message) => message.chat)
  messages!: MessagesModel[];
}
