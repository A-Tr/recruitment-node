import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inject, injectable, singleton } from 'tsyringe';
import { getEnv } from '../../common/Env';
import { NotFoundError } from '../../common/errors/DomainError';
import { LoginResponse } from './SessionModel';
import { UserDB } from './UserModel';
import { UsersRepository } from './UsersRepository';

@injectable()
@singleton()
export class UsersService {
  constructor(@inject(UsersRepository) private repository: UsersRepository) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    let dbUser: UserDB;
    try {
      dbUser = await this.repository.findByEmail(email);
    } catch (error) {
      // We dont want to reveal if its because user does not exist
      // or because of a wrong password
      if (error instanceof NotFoundError) {
        throw new NotFoundError(`Incorrect username or password`);
      } else {
        throw error
      }
    }

    const passwordMatch = await bcrypt.compare(password, dbUser.password)
    if (passwordMatch === false) {
      throw new NotFoundError(`Incorrect username or password`);
    }

    const token = jwt.sign({ email, userId: dbUser.id }, getEnv('JWT_SECRET'), { expiresIn: 60 * 60 });
    return { email, token };
  }
}
