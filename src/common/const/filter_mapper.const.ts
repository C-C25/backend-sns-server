import {
  Any,
  ArrayContainedBy,
  ArrayContains,
  ArrayOverlap,
  Between,
  ILike,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';

export const FILTER_MAPPER = {
  less_than: LessThan,
  less_than_or_equal: LessThanOrEqual,
  more_than: MoreThan,
  more_than_or_equal: MoreThanOrEqual,
  like: Like,
  i_like: ILike,
  between: Between,
  any: Any,
  array_contains: ArrayContains,
  array_contained_by: ArrayContainedBy,
  array_overlap: ArrayOverlap,
};
