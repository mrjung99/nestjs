import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsPositive()
  page: number = 1;

  @IsPositive()
  limit: number = 10;
}
