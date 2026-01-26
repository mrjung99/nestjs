import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  //* ------------------------get all profile --------------------------
  async getAllProfile() {
    const profiles = await this.profileRepository.find({
      relations: {
        user: true, // this only works when the realtion is bi-directional
      },
    });

    if (!profiles.length) {
      throw new NotFoundException('No profile found!');
    }

    return profiles;
  }

  //* ----------------- get profile with the id ---------------
  async getProfileWithId(id: number) {
    const profile = await this.profileRepository.findOneBy({ id });

    if (!profile) {
      throw new NotFoundException(`Can't find the profile with id: ${id}.`);
    }

    return profile;
  }
}
