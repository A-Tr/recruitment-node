import { ValidateError } from '@tsoa/runtime';
import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/ErrorCodes';
import { DomainError } from '../errors/DomainError';
import { getErrorMessage } from '../errors/ErrorMapper';
import { logger } from '../Logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidateError) {
    return res.status(BAD_REQUEST).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }

  if (err instanceof DomainError) {
    logger.error(`Name: ${err.name}. Message: ${err.message}. Stack: ${err.stack}`);
    return res.status(err.code).json({ message: getErrorMessage(err) });
  }

  if (err instanceof Error) {
    logger.error(`Name: ${err.name}. Message: ${err.message}. Stack: ${err.stack}`);
    return res.status(INTERNAL_SERVER_ERROR).json({ message: `Internal Server error. ${getErrorMessage(err)}` });
  }

  if (err) {
    logger.error(`Error: ${getErrorMessage(err)}`);
    return res.status(INTERNAL_SERVER_ERROR).json({ message: `Internal Server error. ${getErrorMessage(err)}` });
  }

  next();
}
