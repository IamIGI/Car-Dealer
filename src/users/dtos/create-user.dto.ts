import { IsEmail, IsString } from 'class-validator';

//thanks to whitelist: true declared in main, extra properties won't be passed to server
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
