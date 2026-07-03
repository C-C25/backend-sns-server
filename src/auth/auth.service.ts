import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '../users/entities/user.entity';
import { ENV_JWT_REFRESH_SECRET_KEY } from '../common/const/keys-values.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signToken(
    user: Pick<UsersModel, 'email' | 'id' | 'role'>,
    isRefresh: boolean,
  ) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      token: isRefresh ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ENV_JWT_REFRESH_SECRET_KEY),
      expiresIn: isRefresh ? '1h' : '5m',
    });
  }
}
