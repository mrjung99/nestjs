import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import authConfig from '../config/auth.config';
import { Reflector } from '@nestjs/core';
import { REQUEST_FIELD_KEY } from '../constant/constant';

//! we can apply guard in the current route, or in controller level or globally
//! to apply route in the current route we use @useGuard(AuthorizedGuard) decoretor
//! for controller level we use same decorator with @controller() decorator

export class AuthorizedGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authconfiguration: ConfigType<typeof authConfig>,
    private readonly reflactor: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflactor.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    //EXTRACT REQUEST FROM THE EXECUATION CONTEXT
    const request: Request = context.switchToHttp().getRequest();

    //EXTRACT JWT TOKEN FROM REQUEST
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    //VALIDATE TOKEN AND PROVIDE/DESNIED ACCESS
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.authconfiguration,
      );
      request[REQUEST_FIELD_KEY] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }

    return true;
  }
}
