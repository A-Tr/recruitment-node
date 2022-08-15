import * as dotenv from 'dotenv';
dotenv.config();

import { pool } from '../src/common/Database';
import { logger } from '../src/common/Logger';


async function seedDb() {
  const client = await pool.connect();
  try {
    // Create Tables
    await client.query(`CREATE TABLE IF NOT EXISTS users 
      (id serial PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at INT NOT NULL,
      updated_at INT NOT NULL);`);

    await client.query(`CREATE TABLE IF NOT EXISTS certificates 
      (id serial PRIMARY KEY,
      owner_id INT,
      country VARCHAR(2),
      status VARCHAR(30) NOT NULL,
      created_at INT NOT NULL,
      updated_at INT NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users (id));`);
    
    
    // Create users
    await client.query(`INSERT INTO users (email, password, created_at, updated_at)
      VALUES ('alvarotrancon@gmail', '1234', ${Math.floor(Date.now() / 1000)}, ${Math.floor(Date.now() / 1000)});
    `);
    
    // Create certificates
    await client.query(`INSERT INTO certificates (country, status, created_at, updated_at)
      VALUES ('ES', 'available', ${Math.floor(Date.now() / 1000)}, ${Math.floor(Date.now() / 1000)});
    `); 
  } catch (error) {
    logger.error(`ERROR SEEDING DATABASE: ${error}`);
  } finally {
    await client.release();
  }
}

seedDb();
