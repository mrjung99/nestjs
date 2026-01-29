import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServide: AuthService) {}

  @Post('login')
  login(@Body() user: { email: string; password: string }) {
    if (!user.email || !user.password) {
      return 'Please enter password and email.';
    }
    return this.authServide.login(user.email, user.password);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    console.log('signup called');

    const user = await this.authServide.signUp(createUserDto);
    return { status: 'success', message: 'user created successfully.', user };
  }
}
