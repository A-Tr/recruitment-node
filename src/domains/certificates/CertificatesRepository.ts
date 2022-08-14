import { Pool } from "pg";
import { pool } from "../../common/Database";
import { Certificate } from "./CertificateModel";

export class CertificatesRepository {
  private tableName = 'certificates';
  private pool: Pool
  constructor() {
    this.pool = pool
  }

  async getNonOwnedCertificates(): Promise<Certificate[]> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(`SELECT * FROM ${this.tableName} WHERE owner_id IS NULL`);
      return res.rows as Certificate[]
    } catch (error) {
      throw new Error(`Error retrieving data from Database: ${error}`)
    } finally {
      client.release();
    }
  }

  async getOwnCertificates(userId: number): Promise<Certificate[]> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(`SELECT * FROM ${this.tableName} 
        WHERE owner_id = $1`, [userId]);
      return res.rows as Certificate[]
    } catch (error) {
      throw new Error(`Error retrieving data from Database: ${error}`)
    } finally {
      client.release();
    }
  }
}
