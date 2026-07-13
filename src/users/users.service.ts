import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepo: Repository<UsersModel>,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepo.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        email: true,
        role: true,
        nickname: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findByUserId(id: number) {
    const user = await this.usersRepo.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        nickname: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('인증할 수 없는 사용자입니다.');
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const existsUserEmail = await this.usersRepo.exists({
      where: {
        email: dto.email,
      },
    });
    if (existsUserEmail) {
      throw new BadRequestException('이미 사용중인 아이디 입니다.');
    }

    const existsUserNickname = await this.usersRepo.exists({
      where: {
        nickname: dto.nickname,
      },
    });

    if (existsUserNickname) {
      throw new BadRequestException('이미 사용중인 닉네임 입니다.');
    }

    const user = this.usersRepo.create({
      email: dto.email,
      password: dto.password,
      nickname: dto.nickname,
    });

    const newUser = await this.usersRepo.save(user);

    return newUser;
  }
}
