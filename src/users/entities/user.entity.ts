import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { RolesEnum } from '../const/roles.enum';
import { PostsModel } from '../../posts/entities/post.entity';

@Entity()
export class UsersModel extends BaseModel {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  @IsString()
  @MaxLength(20)
  @MinLength(2)
  nickname!: string;

  @Exclude({
    toPlainOnly: true,
  })
  @Column({ select: false })
  @IsString()
  password!: string;

  @IsEnum(RolesEnum)
  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role!: RolesEnum;

  @OneToMany(() => PostsModel, (posts) => posts.author)
  posts!: PostsModel[];
}
