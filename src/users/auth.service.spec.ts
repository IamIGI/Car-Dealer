import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of the users service
    //declare method of used service, the value you provides and the values that you expect to get
    fakeUsersService = {
      findByEmail: () => Promise.resolve([]),
      create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
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
    fakeUsersService.findByEmail = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException);
  });
});
