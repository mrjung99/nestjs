import { Injectable, NotFoundException } from '@nestjs/common';
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
    //! we also do eager loading with this
    // this is called eager loading
    return this.userRepository.find({
      relations: {
        profile: true,
      },
    });
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`The user with the id: ${id} doesn't exist.`);
    }

    return user;
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

  public async deleteUser(id: number) {
    // delete user
    await this.userRepository.delete(id);

    return {
      status: 'success',
      message: `User with the id ${id} is deleted successfully!!`,
    };
  }
}
