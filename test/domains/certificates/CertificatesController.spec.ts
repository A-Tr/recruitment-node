import 'reflect-metadata';

import { container } from 'tsyringe';
import { CertificatesController } from '../../../src/domains/certificates/CertificatesController';
import { CertificatesService } from '../../../src/domains/certificates/CertificatesService';
import { AuthorizedRequest } from '../../../src/domains/users/SessionModel';

const mockServiceGetOwnCertificates = jest.fn();
const mockServiceGetAvailableCertificates = jest.fn();
const mockServiceTransferCertificate = jest.fn();
const mockService = {
  getOwnCertificates: mockServiceGetOwnCertificates,
  getAvailableCertificates: mockServiceGetAvailableCertificates,
  transferCertificate:  mockServiceTransferCertificate
};

const mockAuthorizedRequest = { user: { userId: 1, email: 'user@test.com' } } as AuthorizedRequest

describe('CertificatesController tests', () => {
  let controller: CertificatesController;

  beforeEach(() => {
    jest.resetAllMocks();
    controller = container
      .register<CertificatesService>(CertificatesService, { useValue: mockService as unknown as CertificatesService })
      .resolve(CertificatesController);
  });

  describe('getCertificates tests', () => {
    test('should call service.getOwnedCertificates if owned is set to true', async () => {
      await controller.getCertificates('true', mockAuthorizedRequest);
      expect(mockServiceGetOwnCertificates).toHaveBeenCalledWith(1);
    });

    test('should call service.getAvailableCertificates if owned is set to false', async () => {
      await controller.getCertificates('false', mockAuthorizedRequest);
      expect(mockServiceGetAvailableCertificates).toHaveBeenCalled();
    });
  });

  describe('transferCertificate tests', () => {
    test('should call service.transferCertificate with proper args', async () => {
      await controller.transferCertificate(5, mockAuthorizedRequest, {newOwnerId: 2})
      expect(mockServiceTransferCertificate).toHaveBeenCalledWith(5, 1, 2)
    });
  });
});
