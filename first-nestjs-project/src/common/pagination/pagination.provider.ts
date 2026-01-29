import { Injectable, Inject } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from './dto/pagination.query.dto';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from './paginater.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>, // if we want to use where in query like where: {id:userId}
  ): Promise<Paginated<T>> {
    let findOptions: FindManyOptions<T> = {
      skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
      take: paginationQueryDto.limit,
      //page:1 limit:10  => skip:0 take:10
      //page:2 limit:10  => skip:10 take:10
      //page:3 limit:10  => skip:20 take:10
      //formula: (page-1)*limit
    };

    if (where) {
      findOptions.where = where;
    }

    const result = await repository.find(findOptions);

    const totalItems = await repository.count();
    const itemPerPage = paginationQueryDto.limit;
    const currentPage = paginationQueryDto.page;
    const totalPages = Math.ceil(totalItems / paginationQueryDto.limit);
    const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
    const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseUrl);

    const response: Paginated<T> = {
      data: result,
      meta: {
        itemPerPage,
        totalItems,
        currentPage,
        totalPages,
      },
      links: {
        // for this links we have to import REQUEST, Inject from @nestjs/core & Request from express
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=1`,

        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${totalPages}`,

        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${currentPage}`,

        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${nextPage}`,

        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${prevPage}`,
      },
    };

    return response;
  }
}
