import { Pool } from "pg";
import { pool } from "../../common/Database";
import { UserDB } from "./UserModel";

export class UsersRepository {
  private tableName = 'users';
  private pool: Pool
  constructor() {
    this.pool = pool
  }

  async findByEmail(email: string): Promise<UserDB> {
    const client = await this.pool.connect()
    try {
      const res = await client.query(`SELECT * FROM ${this.tableName} WHERE email = $1`, [email])
      if (!res.rows.length) {
        return Promise.reject(new Error(`User with email ${email} does not exist in Database`));
      }
      return res.rows[0] as UserDB;
    } catch (error) {
      throw new Error(`Error retrieving user ${email} from database. Error: ${error}`)
    } finally {
      await client.release();
    }
  }
}