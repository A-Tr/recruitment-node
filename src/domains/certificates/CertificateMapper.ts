import { Certificate, CertificateDB } from './CertificateModel';

export function dbToModel(certificateDb: CertificateDB): Certificate {
  return {
    id: certificateDb.id,
    country: certificateDb.country,
    ownerId: certificateDb.owner_id,
    status: certificateDb.status,
  };
}
