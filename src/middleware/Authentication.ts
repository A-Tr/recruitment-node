import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { getEnv } from '../common/Env';

export async function expressAuthentication(
  req: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  if (securityName != 'jwt') {
    throw new Error(`Security definition ${securityName} not recognized`);
  }

  const token = <string>req.headers['x-access-token'];
  if (!token) {
    throw new Error(`Missing token in header x-access-token`);
  }

  const decodedToken = jwt.verify(token, getEnv('JWT_SECRET')) as jwt.JwtPayload;

  return Promise.resolve({ userId: decodedToken.userId });
}
