import jwt from 'jsonwebtoken';
import { inject, injectable, singleton } from 'tsyringe';
import { getEnv } from '../../common/Env';
import { BadRequestError } from '../../common/errors/DomainError';
import { LoginResponse } from './SessionModel';
import { UsersRepository } from './UsersRepository';

@injectable()
@singleton()
export class UsersService {
  constructor(@inject(UsersRepository) private repository: UsersRepository) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const dbUser = await this.repository.findByEmail(email);
    if (password !== dbUser.password) {
      throw new BadRequestError(`Incorrect username or password`);
    }

    const token = jwt.sign({ email, userId: dbUser.id }, getEnv('JWT_SECRET'), { expiresIn: 60 * 60 });
    return { email, token };
  }
}
