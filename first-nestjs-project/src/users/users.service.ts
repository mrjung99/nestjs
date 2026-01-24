import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create.user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  users: {
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    password: string;
  }[] = [
    {
      firstName: 'hari',
      lastName: 'krishna',
      gender: 'male',
      email: 'hari@gmail.com',
      password: 'test1234',
    },
    {
      firstName: 'shyam',
      lastName: 'hari',
      gender: 'male',
      email: 'shyam@gmail.com',
      password: 'test1234',
    },
    {
      firstName: 'sita',
      lastName: 'maya',
      gender: 'female',
      email: 'sita@gmail.com',
      password: 'test1234',
    },
  ];

  geAllUser() {
    if (this.authService.isAuthorized) {
      return this.users;
    }

    return "You'r not authorized, please login.";
  }

  createUser(user: CreateUserDto) {
    return this.users.push(user);
  }
}
