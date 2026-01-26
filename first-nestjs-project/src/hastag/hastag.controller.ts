import { Body, Controller, Post } from '@nestjs/common';
import { HastagService } from './hastag.service';
import { CreateHastagDto } from './dto/create.hastag.dto';

@Controller('hastag')
export class HastagController {
  constructor(private readonly hastagService: HastagService) {}

  //* ------------------- create hastag --------------------
  @Post()
  createHastag(@Body() createHastagDto: CreateHastagDto) {
    return this.hastagService.createHastag(createHastagDto);
  }
}
