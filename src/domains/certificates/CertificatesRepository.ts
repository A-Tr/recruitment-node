import { Pool } from 'pg';
import { pool } from '../../common/Database';
import { DatabaseError, NotFoundError } from '../../common/errors/DomainError';
import { getErrorMessage } from '../../common/errors/ErrorMapper';
import { CertificateDb } from './CertificateModel';

export class CertificatesRepository {
  private tableName = 'certificates';
  private pool: Pool;
  constructor() {
    this.pool = pool;
  }

  async getNonOwnedCertificates() {
    return this.getAllCertificates();
  }

  async getOwnCertificates(userId: number) {
    return this.getAllCertificates(userId);
  }

  async findById(certificateId: number) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(`SELECT * FROM ${this.tableName} WHERE id = ${certificateId}`);
      if (!res.rows.length) {
        return Promise.reject(new NotFoundError('certificate', 'id', certificateId));
      }
      return res.rows[0] as CertificateDb;
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
        `UPDATE ${this.tableName} SET owner_id = $1, status = 'transferred'
        WHERE id = $2`,
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
      return res.rows as CertificateDb[];
    } catch (error) {
      throw new DatabaseError(getErrorMessage(error));
    } finally {
      client.release();
    }
  }
}
