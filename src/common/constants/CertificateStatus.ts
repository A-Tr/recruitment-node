export const AVAILABLE = 'available';
export const OWNED = 'owned';
export const TRANSFERRED = 'transferred';

const certificateStatus = [AVAILABLE, OWNED, TRANSFERRED];

export type CertificateStatus = typeof certificateStatus[number];
