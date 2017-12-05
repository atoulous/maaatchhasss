import { MongoClient } from 'mongodb';
import fs from 'fs';

import config from '../server/config/index';

export async function save() {
  try {
    const db = await MongoClient.connect(config.db.url);

    const [users, tags, chats] = await Promise.all([
      db.collection('users').find().toArray(),
      db.collection('tags').find().toArray(),
      db.collection('chats').find().toArray()
    ]);

    await Promise.all([
      fs.writeFileSync('scripts/dataSaved/users.json', JSON.stringify(users, null, 2)),
      fs.writeFileSync('scripts/dataSaved/tags.json', JSON.stringify(tags, null, 2)),
      fs.writeFileSync('scripts/dataSaved/chats.json', JSON.stringify(chats, null, 2))
    ]);

    // await Promise.all([
    //   fs.writeFileSync('scripts/dataSaved/users.json', users),
    //   fs.writeFileSync('scripts/dataSaved/tags.json', tags),
    //   fs.writeFileSync('scripts/dataSaved/chats.json', chats)
    // ]);

    db.close();
  } catch (err) {
    throw err;
  }
}

save()
  .then(() => console.info('✔ Database saved in file'))
  .catch(err => console.error(err, '✘ An error happened'))
  .finally(() => process.exit());
