import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginateDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__id: 'ASC' | 'DESC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take?: 20;
}
