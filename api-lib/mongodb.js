import { MongoClient } from 'mongodb';

let indexesCreated = false;
async function createIndexes(client) {
  if (indexesCreated) return client;
  const db = client.db();
  await Promise.all([
    db
      .collection('tokens')
      .createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
    db
      .collection('posts')
      .createIndexes([
        { key: { createdAt: -1 } },
        { key: { creatorId: -1 } },
        { key: { companyId: -1 } },
      ]),
    db
      .collection('comments')
      .createIndexes([
        { key: { createdAt: -1 } },
        { key: { postId: -1 } },
        { key: { companyId: -1 } },
      ]),
    db
      .collection('users')
      .createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { companyId: -1 } },
      ]),
    db
      .collection('company')
      .createIndexes([
        { key: { name: 1 }, unique: true },
        { key: { email: 1 }, unique: true },
        { key: { createdAt: 1 } },
      ]),
    db
      .collection('submission')
      .createIndexes([
        { key: { createdAt: -1 } },
        { key: { startedAt: 1 } },
        { key: { endedAt: 1 } },
        { key: { updateAt: -1 } },
        { key: { creatorId: -1 } },
        { key: { companyId: -1 } },
        { key: { type: -1 } },
        { key: { status: 1 } },
      ]),
    db
      .collection('photos.files')
      .createIndexes([
        { key: { uploadDate: -1 } },
        { key: { filename: 1 }, unique: true },
      ]),
    db
      .collection('attendance')
      .createIndexes([
        { key: { createdAt: -1 } },
        { key: { status: -1 } },
        { key: { userId: -1 } },
        { key: { companyId: -1 } },
      ]),
  ]);
  indexesCreated = true;
  return client;
}

export async function getMongoClient() {
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666
   */
  if (!global.mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    // client.connect() returns an instance of MongoClient when resolved
    global.mongoClientPromise = client
      .connect()
      .then((client) => createIndexes(client));
  }
  return global.mongoClientPromise;
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db();
}
