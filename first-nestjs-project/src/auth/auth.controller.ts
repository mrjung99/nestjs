import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

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
}
