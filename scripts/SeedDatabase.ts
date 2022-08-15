import * as dotenv from 'dotenv';
dotenv.config();

import { pool } from '../src/common/Database';
import { logger } from '../src/common/Logger';
import usersSeeds from '../seeds/users.json';
import certificatesSeeds from '../seeds/certificates.json';

async function seedDb() {
  const client = await pool.connect();
  try {
    // Delete exising tables
    await client.query(`DROP TABLE certificates`);
    await client.query(`DROP TABLE users`);

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
      country VARCHAR(100),
      status VARCHAR(30) NOT NULL,
      created_at INT NOT NULL,
      updated_at INT NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users (id));`);

    // Insert users
    const userValues = usersSeeds.map(u => `('${u.email}', '${u.password}', ${u.created_at}, ${u.updated_at})`)
    await client.query(`INSERT INTO users (email, password, created_at, updated_at)
      VALUES ${userValues.join(', ')};
    `);

    // Insert certificates
    const certificatesValues = certificatesSeeds.map(c => {
      if (!c.ownerId) {
        return `('${c.country}', 'available', NULL, ${c.created_at}, ${c.updated_at})`
      } else {
        return `('${c.country}', 'owned', ${c.ownerId}, ${c.created_at}, ${c.updated_at})`
      }
    });
    await client.query(`INSERT INTO certificates (country, status, owner_id, created_at, updated_at)
      VALUES ${certificatesValues.join(', ')};
    `);
  } catch (error) {
    logger.error(`ERROR SEEDING DATABASE: ${error}`);
  } finally {
    await client.release();
  }
}

seedDb();
