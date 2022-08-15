import { ForbiddenError } from '../../common/errors/DomainError';
import { UsersRepository } from '../users/UsersRepository';
import { dbToModel } from './CertificateMapper';
import { Certificate } from './CertificateModel';
import { CertificatesRepository } from './CertificatesRepository';

export class CertificatesService {
  private repository = new CertificatesRepository();
  private usersRepository = new UsersRepository();

  async getOwnCertificates(userId: number): Promise<Certificate[]> {
    const certificateDbArray = await this.repository.getOwnCertificates(userId);
    return certificateDbArray.map(dbToModel);
  }

  async getNonOwnedCertificates(): Promise<Certificate[]> {
    const certificateDbArray = await this.repository.getNonOwnedCertificates();
    return certificateDbArray.map(dbToModel);
  }

  async transferCertificate(certificateId: number, previousOwnerId: number, newOwnerId: number): Promise<Certificate> {
    let certificateDb = await this.repository.findById(certificateId);
    if (certificateDb.owner_id !== previousOwnerId) {
      throw new ForbiddenError(previousOwnerId);
    }

    await this.usersRepository.findById(newOwnerId);
    
    certificateDb = await this.repository.transferCertificate(certificateId, newOwnerId);
    return dbToModel(certificateDb); 
  }
}
