import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginateDto } from './dto/base.pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from './entities/base.entity';
import { FILTER_MAPPER } from './const/filter_mapper.const';
import {
  ENV_LOCAL_HOST_KEY,
  ENV_LOCAL_PROTOCOL_KEY,
} from './const/keys-values.const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  async paginate<T extends BaseModel>(
    dto: BasePaginateDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page !== undefined) {
      return this.pagePagination<T>(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate<T>(dto, repository, overrideFindOptions, path);
    }
  }
  private async pagePagination<T extends BaseModel>(
    dto: BasePaginateDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const take = dto.take ?? 20;
    const page = dto.page ?? 1;
    const offset = take * (page - 1);

    const where = this.parseWhereFilters<T>(dto);
    const order = this.parseOrderFilters<T>(dto);

    const [data, count] = await repository.findAndCount({
      where,
      order,
      take,
      skip: offset,
      ...overrideFindOptions,
    });

    const totalPage = Math.ceil(count / take);
    const hasNextPage = page < totalPage;

    return {
      data,
      meta: {
        page,
        totalPage,
        total: count,
        hasNextPage,
      },
    };
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginateDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const take = dto.take ?? 20;

    const where = this.parseWhereFilters<T>(dto);
    const order = this.parseOrderFilters<T>(dto);

    const result = await repository.find({
      where,
      order,
      take,
      ...overrideFindOptions,
    });

    const lastItem =
      result.length > 0 && result.length === take
        ? result[result.length - 1]
        : null;

    const protocol = this.configService.get<string>(ENV_LOCAL_PROTOCOL_KEY);
    const host = this.configService.get<string>(ENV_LOCAL_HOST_KEY);

    const nextUrl = lastItem && new URL(`${protocol}://${host}/${path}`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl?.searchParams.append(key, String(dto[key]));
          }
        }
      }

      let key: 'where__id__more_than' | 'where__id__less_than';

      if (dto.order__id === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }
      nextUrl?.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: result,
      cursor: {
        after: lastItem?.id ?? null,
      },
      take: result.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  private parseOrderFilters<T extends BaseModel>(
    dto: BasePaginateDto,
  ): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (!key.startsWith('order__')) continue;
      if (value === undefined || value === null) continue;

      Object.assign(order, this.parseOrderFilter<T>(key, value));
    }

    return order;
  }

  private parseWhereFilters<T extends BaseModel>(
    dto: BasePaginateDto,
  ): FindOptionsWhere<T> {
    const where: FindOptionsWhere<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (!key.startsWith('where__')) continue;
      if (value === undefined || value === null) continue;

      Object.assign(where, this.parseWhereFilter<T>(key, value));
    }
    return where;
  }

  private parseWhereFilter<T extends BaseModel>(
    key: string,
    value: unknown,
  ): FindOptionsWhere<T> {
    const result: Record<string, any> = {};
    const split = key.split('__');

    if (split.length !== 3) {
      throw new BadRequestException(
        `where필터는 where__필드명__연산자 로 구성 되어야 합니다. 문제있는 값: ${key}`,
      );
    }

    const [_, field, operator] = split;
    const filterMapper = FILTER_MAPPER[operator];

    if (!filterMapper) {
      throw new BadRequestException(
        `${operator} 현재 지원하지 않는 기능입니다.`,
      );
    }

    if (operator === 'i_like') {
      result[field] = filterMapper(`%${value}%`);
    } else {
      result[field] = filterMapper(value);
    }

    return result as FindOptionsWhere<T>;
  }

  private parseOrderFilter<T extends BaseModel>(
    key: string,
    value: string,
  ): FindOptionsOrder<T> {
    const result: Record<string, any> = {};

    const split = key.split('__');

    if (split.length !== 2) {
      throw new BadRequestException(
        `order필터는 order__필드명 으로 구성 되어야 합니다. 문제가 있는 값 ${key}`,
      );
    }

    const [_, field] = split;
    result[field] = value;

    return result as FindOptionsOrder<T>;
  }
}
