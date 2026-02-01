import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination.query.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) { }


  @Get()
  @Roles()
  getAllUsers(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.geAllUser(paginationQueryDto);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  // @Post()
  // createUser(@Body() user: CreateUserDto) {
  //   return this.userService.createUser(user);
  // }
  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);

    return {
      status: 'success',
      message: `User with the id:${id} has been deleted.`,
    };
  }
}
