import { MongoClient } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';
import { Database } from 'https://deno.land/x/mongo@v0.22.0/src/database.ts';

let db: Database;

export async function connect() {
  const client = new MongoClient();
  db = await client.connect({
    db: 'node-complete-guide-deno',
    tls: true,
    servers: [
      {
        host: 'cluster0-shard-00-00.oipin.mongodb.net',
        port: 27017,
      },
    ],
    credential: {
      username: 'node-complete-guide',
      password: 'node-complete-guide',
      db: 'admin',
      mechanism: 'SCRAM-SHA-1',
    },
  });
}

export function getDb() {
  if (!db) {
    throw new Error('Db was not established');
  }
  return db;
}
