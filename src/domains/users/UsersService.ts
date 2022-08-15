import { LoginResponse } from './SessionModel';
import { UsersRepository } from './UsersRepository';
import jwt from 'jsonwebtoken';
import { getEnv } from '../../common/Env';

export class UsersService {
  repository: UsersRepository;
  constructor() {
    this.repository = new UsersRepository();
  }
  async login(email: string, password: string): Promise<LoginResponse> {
    const dbUser = await this.repository.findByEmail(email);
    if (password !== dbUser.password) {
      throw new Error(`Incorrect username or password`);
    }

    const token = jwt.sign({ email, userId: dbUser.id }, getEnv('JWT_SECRET'), { expiresIn: 60 * 60 });
    return { email, token };
  }
}
