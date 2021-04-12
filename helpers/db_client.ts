import { MongoClient, Database } from 'https://deno.land/x/mongo@v0.13.0/mod.ts';

let db: Database;
export async function connect() {
  const client = new MongoClient();
  await client.connectWithUri('mongodb+srv://node-complete-guide:node-complete-guide@cluster0.oipin.mongodb.net/?retryWrites=true&w=majority');
  db = client.database("node-complete-guide-deno");
  // db = await client.connect({
  //   db: 'node-complete-guide-deno',
  //   tls: true,
  //   servers: [
  //     {
  //       host: 'cluster0.oipin.mongodb.net',
  //       port: 27017,
  //     },
  //   ],
  //   credential: {
  //     username: 'node-complete-guide',
  //     password: 'node-complete-guide',
  //     db: 'admin',
  //     mechanism: 'SCRAM-SHA-1',
  //   },
  // });
}

export function getDb() {
  if (!db) {
    throw new Error('Db was not established');
  }
  return db;
}
