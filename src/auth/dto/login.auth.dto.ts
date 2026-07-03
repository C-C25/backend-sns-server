import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email!: string;

  @IsString()
  password!: string;
}
