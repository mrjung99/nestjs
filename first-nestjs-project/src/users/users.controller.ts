import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.geAllUser();
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    this.userService.createUser(user);
    return 'User created successfully!!';
  }

  @Patch()
  updateUser(@Body() user: UpdateUserDto) {
    console.log(user);
    return 'user updated successfully';
  }
}
