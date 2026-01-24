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
    let profile = this.profileRepository.create(userDto.profile);
    await this.profileRepository.save(profile);

    // create user object
    let user = this.userRepository.create(userDto);

    //set the profile to the user
    user.profile = profile;

    //save user
    return await this.userRepository.save(user);
  }
}
