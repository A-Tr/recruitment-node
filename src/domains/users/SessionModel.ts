import { Request } from 'express';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  token: string;
}

export interface UserSession {
  userId: number;
  email: string;
}

export interface AuthorizedRequest extends Request {
  user: UserSession;
}
