import { Body, Controller, Get, Patch, Path, Query, Request, Route, Security, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { AuthorizedRequest } from '../users/SessionModel';
import { Certificate } from './CertificateModel';
import { CertificatesService } from './CertificatesService';

@injectable()
@Route('certificates')
@Tags('Carbon Certificates')
export class CertificatesController extends Controller {
  constructor(@inject(CertificatesService) private service: CertificatesService) {
    super();
  }

  @Get('')
  @Security('jwt')
  async getCertificates(@Query() owned: 'true' | 'false', @Request() req: AuthorizedRequest): Promise<Certificate[]> {
    if (owned === 'true') {
      return this.service.getOwnCertificates(req.user.userId);
    } else {
      return this.service.getNonOwnedCertificates();
    }
  }

  @Patch('/{certificateId}/owner')
  @Security('jwt')
  async transferCertificate(
    @Path() certificateId: number,
    @Request() req: AuthorizedRequest,
    @Body() payload: { newOwnerId: number },
  ): Promise<Certificate> {
    return this.service.transferCertificate(certificateId, req.user.userId, payload.newOwnerId);
  }
}
