import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entities/user.entity';

export class CreateUserDto extends PickType(UsersModel, [
  'email',
  'password',
  'nickname',
]) {}
