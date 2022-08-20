import { CertificateStatus } from '../../common/constants/CertificateStatus';

export interface Certificate {
  id: number;
  country: string;
  status: CertificateStatus;
  ownerId?: number;
}

export interface CertificateDB {
  id: number;
  country: string;
  status: CertificateStatus;
  owner_id?: number;
  created_at: number;
  updated_at: number;
}
