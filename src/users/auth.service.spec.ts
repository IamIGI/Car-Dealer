import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of the users service
    //declare method of used service, the value you provides and the values that you expect to get
    const users: User[] = [];
    fakeUsersService = {
      findByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 9999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      //declare used service and values that are used by it
      providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asd@asdf.com', 'asdas');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    const userData = { email: 'user@gmail.com', password: 'mypassword' };

    await service.signup(userData.email, userData.password);
    await expect(service.signup(userData.email, userData.password)).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    //test user is by default empty array, so no user is registered
    await expect(service.signin('test@gmail.com', 'password123')).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('user@gmail.com', '123password123');
    //will be rejected, cuz we do not get the salt of the password
    await expect(service.signin('user@gmail.com', 'password123')).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    const userData = { email: 'user@gmail.com', password: 'mypassword' };

    await service.signup(userData.email, userData.password);

    const user = await service.signin(userData.email, userData.password);
    expect(user).toBeDefined();
  });
});
