import { ObjectId } from 'mongodb';
import { dbProjectionUsersWithEmail } from './user';

export async function findSubmissionById(db, id) {
  return db
    .collection('submission')
    .findOne({ _id: new ObjectId(id) })
    .then((submission) => {
      return submission || null;
    });
}

export async function findSubmissionUser(db, creatorId) {
  return db
    .collection('submission')
    .aggregate([
      {
        $match: {
          ...(creatorId && { creatorId: new ObjectId(creatorId) }),
        },
      },
      { $sort: { _id: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $project: dbProjectionUsersWithEmail('user.') },
    ])
    .toArray();
}

export async function findSubmissionByCompany(
  db,
  companyId,
  startDate,
  endDate
) {
  const today = new Date();

  let start = new Date(startDate ? startDate : today);
  start.setHours(0, 0, 0, 0);

  let end = new Date(endDate ? endDate : today);
  end.setHours(23, 59, 59, 999);
  let matchQuery = {
    ...(companyId && { companyId: new ObjectId(companyId) }),
  };
  if (startDate && endDate) {
    matchQuery = { ...matchQuery, createdAt: { $gte: start, $lt: end } };
  }
  return db
    .collection('submission')
    .aggregate([
      {
        $match: matchQuery,
      },
      { $sort: { _id: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $project: dbProjectionUsersWithEmail('user.') },
    ])
    .toArray();
}

export async function updateSubmissionById(db, id, data) {
  return db
    .collection('submission')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data }
      //   { returnDocument: 'after' }
    )
    .then(({ value }) => value);
}

export async function insertSubmission(
  db,
  {
    status = 'ongoing',
    notes = '',
    type,
    startedAt,
    endedAt,
    creatorId,
    companyId,
  }
) {
  const submissionData = {
    type,
    status,
    notes,
    updateAt: new Date(),
    createdAt: new Date(),
    startedAt: startedAt ? startedAt : new Date(),
    endedAt: endedAt ? endedAt : new Date(),
    creatorId: new ObjectId(creatorId),
    companyId: new ObjectId(companyId),
  };
  const { insertedId } = await db
    .collection('submission')
    .insertOne({ ...submissionData });
  submissionData._id = insertedId;
  return submissionData;
}
