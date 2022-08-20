import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { UserSession } from '../../domains/users/SessionModel';
import { getEnv } from '../Env';
import { ForbiddenError, UnauthorizedError } from '../errors/DomainError';
import { getErrorMessage } from '../errors/ErrorMapper';

export async function expressAuthentication(
  req: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<UserSession> {
  if (securityName != 'jwt') {
    throw new UnauthorizedError(`Security definition ${securityName} not recognized`);
  }

  const token = <string>req.headers['x-access-token'];
  if (!token) {
    throw new UnauthorizedError(`Missing token in header x-access-token`);
  }

  try {
    const decodedToken = jwt.verify(token, getEnv('JWT_SECRET')) as jwt.JwtPayload;
    return Promise.resolve({ userId: decodedToken.userId, email: decodedToken.email });
  } catch (err) {
    throw new ForbiddenError(getErrorMessage(err));
  }
}
