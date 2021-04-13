import { MongoClient } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';
import { Database } from 'https://deno.land/x/mongo@v0.22.0/src/database.ts';

let db: Database;

export async function connect() {
  const client = new MongoClient();
  db = await client.connect({
    db: 'node-complete-guide-deno',
    tls: true,
    servers: [
      // {
      //   host: 'cluster0-shard-00-00.oipin.mongodb.net',
      //   port: 27017,
      // },
      // {
      //   host: 'cluster0-shard-00-01.oipin.mongodb.net',
      //   port: 27017,
      // },
      {
        // This node can be written
        host: 'cluster0-shard-00-02.oipin.mongodb.net',
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
  console.log('Connected to Mongo Atlas');
}

export function getDb() {
  if (!db) {
    throw new Error('Db was not established');
  }
  return db;
}
