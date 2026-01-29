import { Injectable } from '@nestjs/common';
import { HasingProvider } from './hasing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HasingProvider {
  async hashPassword(password: string | Buffer): Promise<string> {
    //SALT PASSWORD
    const salt = await bcrypt.genSalt();
    //HASH PASSWORD
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    plainPassword: string | Buffer,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
