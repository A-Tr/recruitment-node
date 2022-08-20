import { Pool } from 'pg';
import { inject, injectable, singleton } from 'tsyringe';
import { DatabaseError, NotFoundError } from '../../common/errors/DomainError';
import { getErrorMessage } from '../../common/errors/ErrorMapper';
import { UserDB } from './UserModel';

type UserSearchKey = 'id' | 'email';

@injectable()
@singleton()
export class UsersRepository {
  private tableName = 'users';
  constructor(@inject('Pool') private pool: Pool) {}

  async findByEmail(email: string): Promise<UserDB> {
    return this.findByKey('email', email);
  }

  async findById(userId: number): Promise<UserDB> {
    return this.findByKey('id', userId);
  }

  private async findByKey(searchKey: UserSearchKey, searchValue: string | number): Promise<UserDB> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(`SELECT * FROM ${this.tableName} WHERE ${searchKey} = $1`, [searchValue]);
      if (!res.rows.length) {
        return Promise.reject(NotFoundError.generateFromParams('user', searchKey, searchValue));
      }
      return res.rows[0] as UserDB;
    } catch (error) {
      throw new DatabaseError(getErrorMessage(error));
    } finally {
      await client.release();
    }
  }
}
