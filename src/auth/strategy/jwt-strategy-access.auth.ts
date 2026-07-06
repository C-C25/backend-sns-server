import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENV_JWT_ACCESS_SECRET_KEY } from '../../common/const/keys-values.const';
import { JwtPayload } from '../jwt/jwt-payload.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(ENV_JWT_ACCESS_SECRET_KEY)!,
    });
  }
  async validate(payload: JwtPayload) {
    if (payload.token !== 'access') {
      throw new UnauthorizedException('access 토큰이 아닙니다.');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
