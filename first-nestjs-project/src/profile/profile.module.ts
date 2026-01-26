import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Users } from 'src/users/user.entity';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [TypeOrmModule.forFeature([Profile, Users])],
})
export class ProfileModule {}
