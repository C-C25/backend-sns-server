import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

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

  @Column({ select: false })
  @IsString()
  password!: string;

  // TODO
  // roles: Role.USER
}
