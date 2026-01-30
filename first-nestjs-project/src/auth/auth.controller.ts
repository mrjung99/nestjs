import {
  All,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { LoginDto } from './Dto/login.dto';
import { AuthorizedGuard } from './guard/authorized.guard';
import { AllowBypassGuard } from './decorator/allow.bypassguard.decorator';

@Controller('auth')
// @UseGuards(AuthorizedGuard) // this is conroller level guard
export class AuthController {
  constructor(private readonly authServide: AuthService) {}

  //* ---------------user login ------------------
  // @UseGuards(AuthorizedGuard) //this is route level guard
  @AllowBypassGuard()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authServide.login(loginDto);
    return { status: 'success', message: 'Logged in sucessfully!!', token };
  }

  //* ---------------user signup ------------------
  @AllowBypassGuard()
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    console.log('signup called');

    const user = await this.authServide.signUp(createUserDto);
    return { status: 'success', message: 'user created successfully.', user };
  }
}
