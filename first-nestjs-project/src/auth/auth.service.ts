import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create.user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './Dto/login.dto';
import { HasingProvider } from './provider/hasing.provider';
import type { ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userSrvice: UsersService,
    private readonly hasingProvider: HasingProvider,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    //FIND USER WITH THE EMAIL
    let user = await this.userSrvice.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(
        `Invalid email, user with the email doesn't exist!!`,
      );
    }

    //IF USER IS AVAILABLE, COMPARE THE PASSWORD
    const isPasswordMatched = await this.hasingProvider.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect password!!');
    }
    // IF SUCCESS GENERATE THE ACCESSTOKEN. (JWT)
    //generate and send secret key
    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );

    //SEND RESPONSE
    return token;
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this.userSrvice.createUser(createUserDto);
  }
}
