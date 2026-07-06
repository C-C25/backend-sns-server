import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAccessGuard extends AuthGuard('jwt-access') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('토큰이 만료 되었습니다.');
    }

    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    if (!user) {
      throw new UnauthorizedException('인증에 실패했습니다.');
    }

    return user;
  }
}
