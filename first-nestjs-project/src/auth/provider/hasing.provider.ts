// import { Injectable } from '@nestjs/common';

export abstract class HasingProvider {
  abstract hashPassword(password: string | Buffer): Promise<string>;

  abstract comparePassword(
    plainPassword: string | Buffer,
    hashedPassword: string,
  ): Promise<boolean>;
}
