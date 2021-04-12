import { MongoClient } from 'https://deno.land/x/mongo@v0.22.0/mod.ts';
import { Database } from 'https://deno.land/x/mongo@v0.22.0/src/database.ts';


let db: Database;
export async function connect() {
  const client = new MongoClient();
  await client.connect('mongodb+srv://node-complete-guide:node-complete-guide@cluster0.oipin.mongodb.net/node-complete-guide-deno?retryWrites=true&w=majority');
  db = client.database('node-complete-guide-deno');
}

export function getDb() {
  return db;
}
