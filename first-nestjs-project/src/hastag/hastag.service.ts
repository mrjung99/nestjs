import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Hastag } from './hastag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHastagDto } from './dto/create.hastag.dto';

@Injectable()
export class HastagService {
  constructor(
    @InjectRepository(Hastag)
    private hastagRepository: Repository<Hastag>,
  ) {}

  //* ----------------- create hastag ----------------
  async createHastag(hasTag: CreateHastagDto) {
    const tag = this.hastagRepository.create(hasTag);

    await this.hastagRepository.save(tag);
    return {
      status: 'success',
      statuscode: 201,
      message: 'Hastag created successfully.',
    };
  }

  //* ---------------------- get hastag array ------------------
  async getHastagArray(hastags: number[]) {
    return await this.hastagRepository.find({
      where: { id: In(hastags) },
    });
  }

  //* ---------------------- delete hastag ------------------
  async deleteHastag(id: number) {
    await this.hastagRepository.delete({ id });
    return {
      status: 'success',
      message: `Hastag with the id:${id} has been deleted!!`,
    };
  }

  //* ---------------------- soft delete hastag ------------------
  async softDeleteHastag(id: number) {
    await this.hastagRepository.softDelete({ id });
    return {
      status: 'success',
      message: `Hastag with the id:${id} has been soft deleted!!`,
    };
  }
}
