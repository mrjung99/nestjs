import {
  ConflictException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profile/profile.entity';
import { error } from 'console';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination.query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  //* ---------------- get all users -----------------
  geAllUser(paginationQueryDto: PaginationQueryDto) {
    const users = this.paginationProvider.paginateQuery(
      paginationQueryDto,
      this.userRepository,
    );

    if (!users) {
      throw new NotFoundException('Users not found!!');
    }

    return users;
  }

  //* -------------- get user by id ------------------------
  async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`The user with the id: ${id} doesn't exist.`);
    }
    return user;
  }

  //* ------------------- create user ---------------------
  public async createUser(userDto: CreateUserDto) {
    try {
      //create and save profile
      userDto.profile = userDto.profile ?? {};

      // create user object
      let user = this.userRepository.create(userDto);

      //save user
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail?.includes('email')) {
          throw new ConflictException({
            status: 'fail',
            error: { field: 'email', message: 'Email already exist.' },
          });
        }

        if (error.detail?.includes('username')) {
          throw new ConflictException({
            status: 'fail',
            error: { field: 'username', message: 'username already exist.' },
          });
        }
      }
    }

    throw error;
  }

  //* ---------------- delete user --------------------
  public async deleteUser(id: number) {
    try {
      // delete user
      const user = await this.getUserById(id);
      if (!user) {
        throw new NotFoundException(`User with the id:${id} doesn't exist.`);
      }
      await this.userRepository.delete(id);
    } catch (error) {
      throw new RequestTimeoutException(
        'An error has occured, please try again.',
        { description: 'Database connection failed!!' },
      );
    }
  }
}
