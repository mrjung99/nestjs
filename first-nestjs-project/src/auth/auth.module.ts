import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HasingProvider } from './provider/hasing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HasingProvider, //bcause hasingprovider is abstract class
      useClass: BcryptProvider,
    },
  ],
  imports: [forwardRef(() => UsersModule)],
  exports: [HasingProvider],
})
export class AuthModule {}
