import { Pool } from 'pg';
import { getEnv } from './Env';


export const pool = new Pool({
  max: 20,
  user: getEnv('DB_USERNAME'),
  password: getEnv('DB_PASSWORD'),
  host: getEnv('DB_HOST'),
  database: getEnv('DB_NAME'),
  port: parseInt(getEnv('DB_PORT'))
});