import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from '../constants/ErrorCodes';

export abstract class DomainError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, NOT_FOUND);
  }

  static generateFromParams(resource: string, searchKey: string, searchValue: string | number) {
    return new this(`${resource} with ${searchKey} ${searchValue} not found`);
  }
}

export class BadRequestError extends DomainError {
  constructor(message: string) {
    super(message, BAD_REQUEST);
  }
}

export class InternalServerError extends DomainError {
  constructor(message: string) {
    super(message, INTERNAL_SERVER_ERROR);
  }
}

export class DatabaseError extends DomainError {
  constructor(message: string) {
    super(`Database error: ${message}`, INTERNAL_SERVER_ERROR);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string) {
    super(message, FORBIDDEN);
  }

  static fromUserId(userId: number) {
    return new this(`User ${userId} cannot perform this operation`);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(message, UNAUTHORIZED);
  }
}
