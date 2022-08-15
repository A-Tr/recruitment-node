import 'reflect-metadata';

import { Pool } from 'pg';
import { container } from 'tsyringe';
import { CertificatesRepository } from '../../../src/domains/certificates/CertificatesRepository';
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
describe('CertificatesRepository tests', () => {
  let repo: CertificatesRepository;

  beforeEach(() => {
    jest.resetAllMocks();
    repo = container.register<Pool>('Pool', { useValue: mockPool as unknown as Pool }).resolve(CertificatesRepository);
  });

  describe('getNonOwnedCertificates tests', () => {
    test('should make request to Database with proper query and release client', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await repo.getNonOwnedCertificates();
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM certificates WHERE owner_id IS NULL`, []);
      expect(mockRelease).toHaveBeenCalledTimes(1);
    });

    test('should throw error if something happens with database AND release the client', async () => {
      mockQuery.mockRejectedValue(new Error(`Failed to connect to database`));

      expect.assertions(4);
      try {
        await repo.getNonOwnedCertificates();
      } catch (error) {
        expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM certificates WHERE owner_id IS NULL`, []);
        expect(mockRelease).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).message).toEqual('Database error: Error: Failed to connect to database');
      }
    });
  });

  describe('getOwnedCertificates tests', () => {
    test('should make request to Database with proper query and release client', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await repo.getOwnCertificates(1);
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM certificates WHERE owner_id = $1`, [1]);
      expect(mockRelease).toHaveBeenCalledTimes(1);
    });

    test('should throw error if something happens with database AND release the client', async () => {
      mockQuery.mockRejectedValue(new Error(`Failed to connect to database`));

      expect.assertions(4);
      try {
        await repo.getOwnCertificates(1);
      } catch (error) {
        expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM certificates WHERE owner_id = $1`, [1]);
        expect(mockRelease).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).message).toEqual('Database error: Error: Failed to connect to database');
      }
    });
  });

  describe('findById tests', () => {
    test('should make request to Database with proper query, return the found value and release client', async () => {
      const resultDb = {
        id: 1,
        country: 'Canada',
        owner_id: null,
        created_at: 1660572468,
        updated_at: 1660572468,
      }
      mockQuery.mockResolvedValue({
        rows: [resultDb],
      });

      const res = await repo.findById(1);
      expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM certificates WHERE id = $1`, [1]);
      expect(mockRelease).toHaveBeenCalledTimes(1);
      expect(res).toEqual(resultDb)
    });

    test('should throw NotFoundError if it cannnot find a matching certificate AND release the client', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
      });

      expect.assertions(4);
      try {
        await repo.findById(1);
      } catch (error) {
        expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM certificates WHERE id = $1`, [1]);
        expect(mockRelease).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).message).toEqual('certificate with id 1 not found');
      }
    });

    test('should throw error if something happens with database AND release the client', async () => {
      mockQuery.mockRejectedValue(new Error(`Failed to connect to database`));

      expect.assertions(4);
      try {
        await repo.findById(1);
      } catch (error) {
        expect(mockQuery).toHaveBeenCalledWith(`SELECT * FROM certificates WHERE id = $1`, [1]);
        expect(mockRelease).toHaveBeenCalledTimes(1);
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).message).toEqual('Database error: Error: Failed to connect to database');
      }
    });
  });
});
