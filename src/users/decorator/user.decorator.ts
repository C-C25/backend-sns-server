import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

interface RequestUser {
  sub: number;
  email: string;
  role: string;
}

export const User = createParamDecorator(
  (data: keyof RequestUser | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as RequestUser;

    if (!user) {
      throw new InternalServerErrorException(
        'User 데코레이터는 JwtAccessGuard 와 같이 쓰세요.',
      );
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
