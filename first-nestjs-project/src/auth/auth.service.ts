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
import { Users } from 'src/users/user.entity';
import { RefreshToken } from './Dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userSrvice: UsersService,
    private readonly hasingProvider: HasingProvider,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) { }

  //* --------------------- login --------------------------
  async login(loginDto: LoginDto) {
    //FIND USER WITH THE EMAIL
    let user = await this.userSrvice.findUserByEmail(loginDto.email);
    // if (!user) {
    //   throw new UnauthorizedException("User not found!!")
    // }

    //IF USER IS AVAILABLE, COMPARE THE PASSWORD
    const isPasswordMatched = await this.hasingProvider.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect password!!');
    }
    // IF SUCCESS GENERATE THE ACCESS TOKEN. (JWT)
    //generate and send token
    const token = this.generateToken(user)

    //SEND RESPONSE
    return token;
  }

  //* --------------------- sign token --------------------------
  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );
  }

  //* --------------------- generate token --------------------------
  private async generateToken(user: Users) {
    //  ACCESS TOKEN
    const token = await this.signToken(user.id, this.authConfiguration.expiresIn, { email: user.email, role: user.role })
    // REFRESH TOKEN
    const refreshToken = await this.signToken(user.id, this.authConfiguration.refreshTokenExpiresIn)

    return { accessToken: token, refreshToken }
  }

  //*-----------------  REFRESH TOKEN ------------
  public async refreshToken(refreshTokenDto: RefreshToken) {
    try {

      // VERIFY THE USER COMES IN AS REQUEST FROM REFRESH TOKEN WITH REQUEST OBJECT
      // we use destructure method to get sub from the payload
      const { sub } = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: this.authConfiguration.secret,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer
      })
      // FIND THE USER FROM DB
      const user = await this.userSrvice.getUserById(sub)
      // GENERATE AND SEND ACCESS TOKEN AND REFRESH TOKEN
      return this.generateToken(user)
    } catch (error) {
      throw new UnauthorizedException(error)
    }

  }

  //* ---------------- SIGNUP ----------------------
  async signUp(createUserDto: CreateUserDto) {
    return await this.userSrvice.createUser(createUserDto);
  }
}
