import 'reflect-metadata';

import { container } from 'tsyringe';
import { ForbiddenError } from '../../../src/common/errors/DomainError';
import { CertificateDB } from '../../../src/domains/certificates/CertificateModel';
import { CertificatesRepository } from '../../../src/domains/certificates/CertificatesRepository';
import { CertificatesService } from '../../../src/domains/certificates/CertificatesService';
import { UserDB } from '../../../src/domains/users/UserModel';
import { UsersRepository } from '../../../src/domains/users/UsersRepository';

const mockCertRepoGetOwnCertificates = jest.fn();
const mockCertRepoGetAvailableCertificates = jest.fn();
const mockCertRepoFindById = jest.fn();
const mockCertRepoTransferCertificate = jest.fn();
const mockUsersRepoFindById = jest.fn();

const mockCertRepo = {
  getOwnCertificates: mockCertRepoGetOwnCertificates,
  getAvailableCertificates: mockCertRepoGetAvailableCertificates,
  findById: mockCertRepoFindById,
  transferCertificate: mockCertRepoTransferCertificate
};

const mockUsersRepo = {
  findById: mockUsersRepoFindById,
};
const TEST_USER_ID = 1;

describe('CertificatesService tests', () => {
  let service: CertificatesService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = container
      .register<CertificatesRepository>(CertificatesRepository, {
        useValue: mockCertRepo as unknown as CertificatesRepository,
      })
      .register<UsersRepository>(UsersRepository, { useValue: mockUsersRepo as unknown as UsersRepository })
      .resolve(CertificatesService);
  });

  describe('getOwnCertificates tests', () => {
    const TEST_OWNED_DB_CERTIFICATE: CertificateDB = {
      country: 'Spain',
      id: 1,
      status: 'owned',
      owner_id: TEST_USER_ID,
      created_at: 1660987957,
      updated_at: 1660987957,
    };

    test('should call certsRepo and return mapped certificates', async () => {
      mockCertRepoGetOwnCertificates.mockResolvedValue([TEST_OWNED_DB_CERTIFICATE]);

      const result = await service.getOwnCertificates(TEST_USER_ID);
      expect(mockCertRepoGetOwnCertificates).toHaveBeenCalledWith(TEST_USER_ID);
      expect(result).toEqual([{ country: 'Spain', id: 1, ownerId: 1, status: 'owned' }]);
    });
  });

  describe('getAvailableCertificates tests', () => {
    const TEST_AVAILABLE_DB_CERTIFICATE: CertificateDB = {
      country: 'Spain',
      id: 2,
      status: 'available',
      created_at: 1660987957,
      updated_at: 1660987957,
    };

    test('should call certsRepo and return mapped certificates', async () => {
      mockCertRepoGetAvailableCertificates.mockResolvedValue([TEST_AVAILABLE_DB_CERTIFICATE]);

      const result = await service.getAvailableCertificates();
      expect(mockCertRepoGetAvailableCertificates).toHaveBeenCalledWith();
      expect(result).toEqual([{ country: 'Spain', id: 2, ownerId: undefined, status: 'available' }]);
    });
  });

  describe('transferCertificate tests', () => {
    test('should allow transfer if cert is owned by user', async () => {
      const TEST_OWNED_DB_CERTIFICATE: CertificateDB = {
        country: 'Spain',
        id: 1,
        status: 'owned',
        owner_id: TEST_USER_ID,
        created_at: 1660987957,
        updated_at: 1660987957,
      };

      const TEST_NEW_OWNER_ID = 2
      const TEST_NEW_USER: UserDB = {
        id: TEST_NEW_OWNER_ID,
        email: 'newowner@test.com',
        password: '1234',
        created_at: 1660987957,
        updated_at: 1660987957
      }
      mockCertRepoFindById.mockResolvedValue(TEST_OWNED_DB_CERTIFICATE);
      mockUsersRepoFindById.mockResolvedValue(TEST_NEW_USER)
      mockCertRepoTransferCertificate.mockResolvedValue({...TEST_OWNED_DB_CERTIFICATE, status: 'transferred', owner_id: 2})
      
      const result = await service.transferCertificate(1, TEST_USER_ID, TEST_NEW_OWNER_ID);
      
      expect(result).toEqual({ country: 'Spain', id: 1, ownerId: 2, status: 'transferred' });
    });

    test('should throw Forbidden error if cert is not owned by user', async () => {
      const TEST_OWNED_DB_CERTIFICATE: CertificateDB = {
        country: 'Spain',
        id: 1,
        status: 'owned',
        owner_id: 3,
        created_at: 1660987957,
        updated_at: 1660987957,
      };

      mockCertRepoFindById.mockResolvedValue(TEST_OWNED_DB_CERTIFICATE);
      
      expect.assertions(2)
      try {
        await service.transferCertificate(1, TEST_USER_ID, 2)
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError)
        expect((error as ForbiddenError).message).toBe('User 1 cannot perform this operation')
      }
    });
  });
});
