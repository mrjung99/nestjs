import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  isAuthorized: boolean = false;

  login(email: string, password: string) {
    const findUser = this.userService.users.find(
      (u) => u.email === email && u.password === password,
    );
    if (findUser) {
      this.isAuthorized = true;
      return 'Login successful.';
    }

    return "Email or password doesn't match, try agian.";
  }
}
