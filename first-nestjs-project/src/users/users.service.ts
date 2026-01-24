import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profile/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  geAllUser() {
    return this.userRepository.find();
  }

  public async createUser(userDto: CreateUserDto) {
    //create and save profile
    userDto.profile = userDto.profile ?? {};
    // here profile will automatically created due to cascading, we use property cascade:['insert'] on onetoone

    // create user object
    let user = this.userRepository.create(userDto);

    //save user
    return await this.userRepository.save(user);
  }
}
