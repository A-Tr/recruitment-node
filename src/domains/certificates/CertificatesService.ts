import { inject, injectable, singleton } from 'tsyringe';
import { ForbiddenError } from '../../common/errors/DomainError';
import { UsersRepository } from '../users/UsersRepository';
import { dbToModel } from './CertificateMapper';
import { Certificate } from './CertificateModel';
import { CertificatesRepository } from './CertificatesRepository';

@injectable()
@singleton()
export class CertificatesService {
  constructor(
    @inject(CertificatesRepository) private repository: CertificatesRepository,
    @inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async getOwnCertificates(userId: number): Promise<Certificate[]> {
    const certificateDbArray = await this.repository.getOwnCertificates(userId);
    return certificateDbArray.map(dbToModel);
  }

  async getAvailableCertificates(): Promise<Certificate[]> {
    const certificateDbArray = await this.repository.getAvailableCertificates();
    return certificateDbArray.map(dbToModel);
  }

  async transferCertificate(certificateId: number, previousOwnerId: number, newOwnerId: number): Promise<Certificate> {
    let certificateDb = await this.repository.findById(certificateId);
    if (certificateDb.owner_id !== previousOwnerId) {
      throw ForbiddenError.fromUserId(previousOwnerId);
    }

    await this.usersRepository.findById(newOwnerId);

    certificateDb = await this.repository.transferCertificate(certificateId, newOwnerId);
    return dbToModel(certificateDb);
  }
}
