import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HasingProvider } from './provider/hasing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HasingProvider, //bcause hasingprovider is abstract class
      useClass: BcryptProvider,
    },
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  exports: [HasingProvider],
})
export class AuthModule {}
