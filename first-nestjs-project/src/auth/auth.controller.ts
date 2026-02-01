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
import { RefreshToken } from './Dto/refresh-token.dto';

@Controller('auth')
// @UseGuards(AuthorizedGuard) // this is controller level guard
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //* ---------------user login ------------------
  // @UseGuards(AuthorizedGuard) //this is route level guard
  @AllowBypassGuard()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return { status: 'success', message: 'Logged in successfully!!', token };
  }

  //* ---------------user signup ------------------
  @AllowBypassGuard()
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    console.log('signup called');

    const user = await this.authService.signUp(createUserDto);
    return { status: 'success', message: 'user created successfully.', user };
  }

  //* ------------ REFRESH TOKEN ---------------
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshToken: RefreshToken) {
    return this.authService.refreshToken(refreshToken)
  }
}
