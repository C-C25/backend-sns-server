import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '../users/entities/user.entity';
import {
  ENV_HASH_ROUNDS_KEY,
  ENV_JWT_ACCESS_SECRET_KEY,
  ENV_JWT_REFRESH_SECRET_KEY,
} from '../common/const/keys-values.const';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register.auth.dto';
import { LoginUserDto } from './dto/login.auth.dto';
import { stringify } from 'querystring';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async accessSignToken(user: Pick<UsersModel, 'email' | 'id' | 'role'>) {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      token: 'access',
    };

    return this.jwtService.sign(accessPayload, {
      secret: this.configService.get<string>(ENV_JWT_ACCESS_SECRET_KEY),
      expiresIn: '5m',
    });
  }

  async refreshSignToken(user: Pick<UsersModel, 'email' | 'id' | 'role'>) {
    const refreshPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      token: 'refresh',
    };

    return this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>(ENV_JWT_REFRESH_SECRET_KEY),
      expiresIn: '1h',
    });
  }

  async loginUser(user: Pick<UsersModel, 'email' | 'id' | 'role'>) {
    return {
      accessToken: await this.accessSignToken(user),
      refreshToken: await this.refreshSignToken(user),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const userEmail = await this.usersService.findByEmail(user.email);

    if (!userEmail) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const userPassword = await bcrypt.compare(
      user.password,
      userEmail.password,
    );

    if (!userPassword) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    return userEmail;
  }

  async registerWithEmail(dto: RegisterUserDto) {
    const hash = await bcrypt.hash(
      dto.password,
      parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)!),
    );

    const newUser = await this.usersService.createUser({
      ...dto,
      password: hash,
    });

    return this.loginUser(newUser);
  }

  async loginWithEmail(dto: LoginUserDto) {
    const user = await this.authenticateWithEmailAndPassword(dto);

    return await this.loginUser(user);
  }
}
