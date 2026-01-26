import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TweetModule } from './tweet/tweet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
// import { Users } from './users/user.entity';
import { HastagModule } from './hastag/hastag.module';

@Module({
  imports: [
    UsersModule,
    TweetModule,
    ProfileModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        // entities: [Users],
        autoLoadEntities: true,
        synchronize: true,
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'jung1234',
        database: 'nestjs',
      }),
    }),
    HastagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
