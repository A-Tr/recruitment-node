import { Controller, Get, Query, Request, Route, Security } from 'tsoa';
import { Certificate } from './CertificateModel';
import { CertificatesService } from './CertificatesService';

@Route('certificates')
export class CertificatesController extends Controller {
  private service = new CertificatesService();

  @Get('')
  @Security('jwt')
  async getCertificates(@Query() owned: 'true' | 'false', @Request() req: any): Promise<Certificate[]> {
    if (owned === 'true') {
      return this.service.getOwnCertificates(req.user.userId);
    } else {
      return this.service.getNonOwnedCertificates();
    }
  }
}
