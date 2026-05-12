import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const seedFile = path.join(currentDir, 'seeds', 'dev.sql');

async function main() {
  const sql = await readFile(seedFile, 'utf8');
  await pool.query(sql);
  console.log('Development seed data has been applied.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
