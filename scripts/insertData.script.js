import { MongoClient, ObjectId } from 'mongodb';
import _ from 'lodash';
import fs from 'fs';

import config from '../server/config/index';

export async function save() {
  try {
    const db = await MongoClient.connect(config.db.url);

    const [chatsFile, tagsFile, usersFile] = await Promise.all([
      fs.readFileSync('scripts/dataSaved/chats.json', 'utf8'),
      fs.readFileSync('scripts/dataSaved/tags.json', 'utf8'),
      fs.readFileSync('scripts/dataSaved/users.json', 'utf8')
    ]);

    const chats = _.map(JSON.parse(chatsFile), (e) => {
      if (e) {
        if (e._id) e._id = ObjectId(e._id);
        if (e.from) e.from = ObjectId(e.from);
        if (e.to) e.to = ObjectId(e.to);
      }
      return e;
    });

    const tags = _.map(JSON.parse(tagsFile), (e) => {
      if (e) {
        if (e._id) e._id = ObjectId(e._id);
        // if (e.creator) e.creator = ObjectId(e.creator);
      }
      return e;
    });

    const users = _.map(JSON.parse(usersFile), (e) => {
      if (e) {
        if (e._id) e._id = ObjectId(e._id);
        if (e.likes) {
          e.likes = e.likes.map(like => ObjectId(like));
        }
        if (e.dislikes) {
          e.dislikes = e.dislikes.map(dislike => ObjectId(dislike));
        }
      }
      return e;
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await Promise.all([
      db.collection('users').insertMany(users),
      db.collection('tags').insertMany(tags),
      db.collection('chats').insertMany(chats)
    ]);
  } catch (err) {
    throw err;
  }
}

save()
  .then(() => console.info('✔ Data inserted in base'))
  .catch(err => console.error(err, '✘ An error happened'))
  .finally(() => process.exit());
