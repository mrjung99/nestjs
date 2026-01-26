import { Module } from '@nestjs/common';
import { HastagController } from './hastag.controller';
import { HastagService } from './hastag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hastag } from './hastag.entity';

@Module({
  controllers: [HastagController],
  providers: [HastagService],
  exports: [HastagService],
  imports: [TypeOrmModule.forFeature([Hastag])],
})
export class HastagModule {}
