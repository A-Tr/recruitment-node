import 'reflect-metadata';

import { container } from 'tsyringe';
import { DatabaseError, DomainError, NotFoundError } from '../../../src/common/errors/DomainError';
import { UsersRepository } from '../../../src/domains/users/UsersRepository';
import { UsersService } from '../../../src/domains/users/UsersService';
import { UserDB } from '../../../src/domains/users/UserModel';

const mockUsersRepoFindByEmail = jest.fn();
const mockUsersRepo = {
  findByEmail: mockUsersRepoFindByEmail,
};

const TEST_EMAIL = 'user@test.com';
const TEST_PASSWORD = '1234';
const TEST_USER_DB: UserDB = {
  id: 1,
  email: TEST_EMAIL,
  password: '$2b$10$Xyrl2E8z4Vawak/JBkUVleAzfD7fUA0G6hUtrP/fgdYsjRB83ns9G',
  created_at: 1660987957,
  updated_at: 1660987957,
};

describe('UsersService tests', () => {
  let service: UsersService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    // We freeze system time so JWT token is always the same
    jest.useFakeTimers().setSystemTime(1660992924005);
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    service = container
      .register<UsersRepository>(UsersRepository, { useValue: mockUsersRepo as unknown as UsersRepository })
      .resolve(UsersService);
  });

  describe('login tests', () => {
    test('should return email and token if user exists and password matchs', async () => {
      mockUsersRepoFindByEmail.mockResolvedValue(TEST_USER_DB);

      const result = await service.login(TEST_EMAIL, TEST_PASSWORD);
      expect(result).toEqual({
        email: TEST_EMAIL,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAdGVzdC5jb20iLCJ1c2VySWQiOjEsImlhdCI6MTY2MDk5MjkyNCwiZXhwIjoxNjYwOTk2NTI0fQ.VDVf9x_ts1ZgJIeof-XVWxqWRXx8EnKC78OcRyxbGqc',
      })
    });

    test('should throw wrapped Not Found error if no user in Database', async () => {
      mockUsersRepoFindByEmail.mockRejectedValue(NotFoundError.generateFromParams('user', 'email', 1))

      expect.assertions(1)
      try {
        await service.login(TEST_EMAIL, TEST_PASSWORD)
      } catch (error) {
        expect((error as NotFoundError).message).toBe('Incorrect username or password')
      }
    });

    test('should throw same Error if something happens at database', async () => {
      mockUsersRepoFindByEmail.mockRejectedValue(new DatabaseError('Error connecting to Database'))

      expect.assertions(1)
      try {
        await service.login(TEST_EMAIL, TEST_PASSWORD)
      } catch (error) {
        expect((error as DomainError).message).toBe('Database error: Error connecting to Database')
      }
    });

    test('should throw wrapped Not Found error if password does not match', async () => {
      mockUsersRepoFindByEmail.mockResolvedValue(TEST_USER_DB);
      
      expect.assertions(1)

      try {
        await service.login(TEST_EMAIL, 'wrongpassword');
      } catch (error) {
        expect((error as NotFoundError).message).toBe('Incorrect username or password')
      }
    });
  });
});
