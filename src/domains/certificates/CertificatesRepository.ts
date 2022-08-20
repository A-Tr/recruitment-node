import { Pool } from 'pg';
import { inject, injectable, singleton } from 'tsyringe';
import { DatabaseError, NotFoundError } from '../../common/errors/DomainError';
import { getErrorMessage } from '../../common/errors/ErrorMapper';
import { CertificateDB } from './CertificateModel';

@singleton()
@injectable()
export class CertificatesRepository {
  private tableName = 'certificates';
  constructor(@inject('Pool') private pool: Pool) {}

  async getAvailableCertificates() {
    return this.getAllCertificates();
  }

  async getOwnCertificates(userId: number) {
    return this.getAllCertificates(userId);
  }

  async findById(certificateId: number) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [certificateId]);
      if (!res.rows.length) {
        return Promise.reject(NotFoundError.generateFromParams('certificate', 'id', certificateId));
      }
      return res.rows[0] as CertificateDB;
    } catch (error) {
      throw new DatabaseError(getErrorMessage(error));
    } finally {
      client.release();
    }
  }

  async transferCertificate(certificateId: number, newUserId: number) {
    const client = await this.pool.connect();
    try {
      await client.query(
        `UPDATE ${this.tableName} SET owner_id = $1, status = 'transferred' WHERE id = $2`,
        [newUserId, certificateId],
      );
      return this.findById(certificateId);
    } catch (error) {
      throw new DatabaseError(getErrorMessage(error));
    } finally {
      client.release();
    }
  }

  private async getAllCertificates(userId?: number) {
    const client = await this.pool.connect();
    try {
      const queryArgs: { query: string; args: (string | number)[] } = userId
        ? { query: `SELECT * FROM ${this.tableName} WHERE owner_id = $1`, args: [userId] }
        : { query: `SELECT * FROM ${this.tableName} WHERE owner_id IS NULL`, args: [] };
      const res = await client.query(queryArgs.query, queryArgs.args);
      return res.rows as CertificateDB[];
    } catch (error) {
      throw new DatabaseError(getErrorMessage(error));
    } finally {
      client.release();
    }
  }
}
