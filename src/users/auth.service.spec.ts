import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const fakeUserService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    // Create a fake copy of the users service
    expect(service).toBeDefined();
  });

  it('Create a new user with salted password', async () => {
    const user = await service.signup('asd@asd.com', 'asd');
    expect(user.password).not.toEqual('asd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
});
