import { ValidateError } from '@tsoa/runtime';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidateError) {
		return res.status(400).json({
			message: 'Validation Failed',
			details: err?.fields
		});
	}

  if (err instanceof Error) {
    return res.status(500).json({ message: `Internal Server error. ${err}`})
  }

  next()
}