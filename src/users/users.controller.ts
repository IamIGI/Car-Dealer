import { Body, Controller, Get, Post, Patch, Param, Query, Delete, HttpCode, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) // Use on all requests
export class UsersController {
  constructor(private usersService: UsersService, private authService: AuthService) {}

  // @Get('/whoami')
  // whoami(@Session() session: any) {
  //   return this.usersService.findOne(session.userID);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard) // if user is not signin, he can't access this route
  whoami(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userID = user.id;
    return user;
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userID = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userID = null;
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
