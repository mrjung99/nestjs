import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  geAllUser() {
    return this.userRepository.find();
  }

  public async createUser(userDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (user) {
      return 'User already exist with that email, try another one.';
    }

    let newUser = this.userRepository.create(userDto);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }
}
