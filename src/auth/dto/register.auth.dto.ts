import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail(
    {},
    {
      message: '이메일 형식이 아닙니다.',
    },
  )
  email!: string;

  @IsString()
  @MaxLength(2)
  @MinLength(20)
  nickname!: string;

  @IsString()
  password!: string;
}
