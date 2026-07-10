import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req.queryRunner) {
      throw new InternalServerErrorException(
        `QueryRunner 데코레이터를 사용할때 TransactionInterceptor를 적용해야 합니다.`,
      );
    }

    return req.queryRunner;
  },
);
