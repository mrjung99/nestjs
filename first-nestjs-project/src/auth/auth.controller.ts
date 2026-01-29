import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { LoginDto } from './Dto/login.dto';
import { ok } from 'assert';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServide: AuthService) {}

  //* ---------------user login ------------------
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authServide.login(loginDto);
  }

  //* ---------------user signup ------------------
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    console.log('signup called');

    const user = await this.authServide.signUp(createUserDto);
    return { status: 'success', message: 'user created successfully.', user };
  }
}
