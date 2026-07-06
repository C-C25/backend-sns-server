import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { UsersModel } from '../../users/entities/user.entity';
import { IsString } from 'class-validator';

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author!: UsersModel;

  @Column({ type: 'text' })
  @IsString()
  title!: string;

  @Column({ type: 'varchar' })
  @IsString()
  content!: string;

  @Column({ default: 0 })
  commentCount!: number;

  @Column({ default: 0 })
  likeCount!: number;
}
