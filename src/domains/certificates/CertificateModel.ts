type CertificateStatus = 'available' | 'owned' | 'transferred';

export interface Certificate {
  id: number;
  country: string;
  status: CertificateStatus;
  ownerId?: number;
}

export interface CertificateDb {
  id: number;
  country: string;
  status: CertificateStatus;
  owner_id?: number;
  created_at: number;
  updated_at: number;
}
