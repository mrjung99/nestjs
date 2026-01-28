import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from './dto/pagination.query.dto';

@Injectable()
export class PaginationProvider {
  async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>, // if we want to use where in query like where: {id:userId}
  ) {
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

    return await repository.find(findOptions);
  }
}
