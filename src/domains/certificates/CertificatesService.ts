import { Certificate } from "./CertificateModel";
import { CertificatesRepository } from "./CertificatesRepository";

export class CertificatesService {
  private repository = new CertificatesRepository();

  async getOwnCertificates(userId: number): Promise<Certificate[]> {
    return this.repository.getOwnCertificates(userId);
  }

  async getNonOwnedCertificates(): Promise<Certificate[]> {
    return this.repository.getNonOwnedCertificates();
  }
}