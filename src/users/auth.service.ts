import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt); // allow for promises technology

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //See if email is in use
    const user = await this.usersService.findByEmail(email);
    if (user.length) throw new BadRequestException('email in use');

    //Hash users password
    //Generate a salt
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //Join the hashed result and join them together
    const result = `${salt}.${hash.toString('hex')}`;

    //Create new user and save it
    const newUser = await this.usersService.create(email, result);
    //return the user
    return newUser;
  }

  signin() {}
}
