import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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

  //* ---------------------- delete hastag ------------------
  @Delete(':id')
  deleteHastag(@Param('id', ParseIntPipe) id: number) {
    return this.hastagService.deleteHastag(id);
  }

  //* ---------------------- soft delete hastag ------------------
  @Delete('soft-delete/:id')
  softDeleteHastag(@Param('id', ParseIntPipe) id: number) {
    return this.hastagService.softDeleteHastag(id);
  }
}
