import { Certificate, CertificateDb } from './CertificateModel';

export function dbToModel(certificateDb: CertificateDb): Certificate {
  return {
    id: certificateDb.id,
    country: certificateDb.country,
    ownerId: certificateDb.owner_id,
    status: certificateDb.status,
  };
}
