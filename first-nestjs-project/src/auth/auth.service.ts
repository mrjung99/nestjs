import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  isAuthorized: boolean = false;

  login(email: string, password: string) {}
}
