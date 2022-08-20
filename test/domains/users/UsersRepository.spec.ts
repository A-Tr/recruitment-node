import 'reflect-metadata';

import { Pool } from 'pg';
import { container } from 'tsyringe';
import { UsersRepository } from '../../../src/domains/users/UsersRepository';
import { DatabaseError, NotFoundError } from '../../../src/common/errors/DomainError';

const mockQuery = jest.fn();
const mockRelease = jest.fn();
const mockClient = {
  query: mockQuery,
  release: mockRelease,
};

const mockPool = {
  connect() {
    return Promise.resolve(mockClient);
  },
};

describe('UsersRepository tests', () => {
  let repo: UsersRepository;

  beforeEach(() => {
    jest.resetAllMocks();
    repo = container.register<Pool>('Pool', { useValue: mockPool as unknown as Pool }).resolve(UsersRepository);
  });

  describe('findById tests', () => {
    test('should make request to Database with proper query, return the found value and release client', async () => {
      const TEST_USER_ID = 1
      const resultDb = {
        id: TEST_USER_ID,
        email: 'user@test.com',
        password: '1234',
        created_at: 1660987957,
        updated_at: 1660987957
      }
      mockQuery.mockResolvedValue({
        rows: [resultDb],
      });

      const res = await repo.findById(TEST_USER_ID);
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM users WHERE id = $1`, [TEST_USER_ID]);
      expect(mockRelease).toHaveBeenCalledTimes(1);
      expect(res).toEqual(resultDb)
    });

    test('should throw NotFoundError if it cannnot find a matching user AND release the client', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
      });

      expect.assertions(4);
      try {
        await repo.findById(1);
      } catch (error) {
        expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM users WHERE id = $1`, [1]);
        expect(mockRelease).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toEqual('user with id 1 not found');
      }
    });

    test('should throw error if something happens with database AND release the client', async () => {
      mockQuery.mockRejectedValue(new Error(`Failed to connect to database`));

      expect.assertions(4);
      try {
        await repo.findById(1);
      } catch (error) {
        expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM users WHERE id = $1`, [1]);
        expect(mockRelease).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).message).toEqual('Database error: Error: Failed to connect to database');
      }
    });
  });

  describe('findByEmail tests', () => {
    test('should make request to Database with proper query, return the found value and release client', async () => {
      const TEST_USER_EMAIL = 'user@test.com'
      const resultDb = {
        id: 1,
        email: TEST_USER_EMAIL,
        password: '1234',
        created_at: 1660987957,
        updated_at: 1660987957
      }
      mockQuery.mockResolvedValue({
        rows: [resultDb],
      });

      const res = await repo.findByEmail(TEST_USER_EMAIL);
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM users WHERE email = $1`, [TEST_USER_EMAIL]);
      expect(mockRelease).toHaveBeenCalledTimes(1);
      expect(res).toEqual(resultDb)
    });
  });
});
