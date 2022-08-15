import { logger } from './Logger';

export function getEnv(key: string, throwErr = true): string {
  const value = process.env[key];

  if (value === undefined || value === null) {
    if (throwErr) {
      logger.error(`Missing env key ${key}`);
      throw new Error(`Missing env key ${key}`);
    } else {
      logger.warn(`Missing env key ${key}. Returning empty string`);
      return '';
    }
  }

  return value;
}
