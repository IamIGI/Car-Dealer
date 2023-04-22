import { Body, Controller, Get, Post, Patch, Param, Query, Delete } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto) // Use ona all requests
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  @Get('/all')
  findUsers() {
    return this.usersService.findAll();
  }

  @Get()
  findUsersByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // --------- requests with params have to be on the bottom ----------------

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
