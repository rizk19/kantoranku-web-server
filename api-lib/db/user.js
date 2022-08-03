import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import normalizeEmail from 'validator/lib/normalizeEmail';
import { dbProjectionCompany } from './company';

export async function findUserWithEmailAndPassword(db, email, password) {
  email = normalizeEmail(email);
  const user = await db.collection('users').findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined }; // filtered out password
  }
  return null;
}

export async function findUserForAuth(db, userId) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then((user) => user || null);
}

export async function findUserById(db, userId) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function findUserByUsername(db, username) {
  return db
    .collection('users')
    .findOne({ username }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function findUserByEmail(db, email) {
  email = normalizeEmail(email);
  return db
    .collection('users')
    .findOne({ email }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function findUsersByCompany(db, limit = 10, companyId) {
  return db
    .collection('users')
    .aggregate([
      {
        $match: {
          ...(companyId && { companyId: new ObjectId(companyId) }),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'company',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $unwind: '$company' },
      { $project: dbProjectionUsersWithEmail() },
      { $project: dbProjectionCompany('company.') },
    ])
    .toArray();
}

export async function updateUserById(db, id, data) {
  return db
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    .then(({ value }) => value);
}

export async function insertUser(
  db,
  {
    email,
    originalPassword,
    bio = '',
    name = '',
    profilePicture,
    username = '',
    companyId,
    role = 'admin',
  }
) {
  const user = {
    emailVerified: false,
    profilePicture,
    email,
    name,
    username,
    bio,
    companyId: new ObjectId(companyId),
    role,
  };
  const password = await bcrypt.hash(originalPassword, 10);
  const { insertedId } = await db
    .collection('users')
    .insertOne({ ...user, password });
  user._id = insertedId;
  return user;
}

export async function updateUserPasswordByOldPassword(
  db,
  id,
  oldPassword,
  newPassword
) {
  const user = await db.collection('users').findOne(new ObjectId(id));
  if (!user) return false;
  const matched = await bcrypt.compare(oldPassword, user.password);
  if (!matched) return false;
  const password = await bcrypt.hash(newPassword, 10);
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
  return true;
}

export async function UNSAFE_updateUserPassword(db, id, newPassword) {
  const password = await bcrypt.hash(newPassword, 10);
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
}

export function dbProjectionUsers(prefix = '') {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  };
}

export function dbProjectionUsersWoutCompany(prefix = '') {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
    [`${prefix}companyId`]: 0,
  };
}

export function dbProjectionUsersWithEmail(prefix = '') {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}emailVerified`]: 0,
    [`${prefix}companyId`]: 0,
    [`${prefix}bio`]: 0,
  };
}
