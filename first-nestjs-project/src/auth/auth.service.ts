import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userSrvice: UsersService,
  ) {}

  login(email: string, password: string) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userSrvice.createUser(createUserDto);
  }
}
