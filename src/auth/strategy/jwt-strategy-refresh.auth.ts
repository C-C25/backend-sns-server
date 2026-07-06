import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENV_JWT_REFRESH_SECRET_KEY } from '../../common/const/keys-values.const';
import { JwtPayload } from '../jwt/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(ENV_JWT_REFRESH_SECRET_KEY)!,
    });
  }
  async validate(payload: JwtPayload) {
    if (payload.token !== 'refresh') {
      throw new UnauthorizedException('refresh 토큰이아닙니다.');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
