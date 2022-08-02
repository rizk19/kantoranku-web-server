import { ObjectId } from 'mongodb';
import { dbProjectionUsersWithEmail } from './user';

//masih rusak
export async function findAttendanceUserToday(db, creatorId) {
  const today = new Date();

  let start = new Date(today);
  start.setDate(start.getDate() - 0);
  start.setHours(0, 0, 0, 0);

  let end = new Date(today);
  end.setDate(end.getDate() - 0);
  end.setHours(23, 59, 59, 999);
  return db
    .collection('attendance')
    .findOne({
      $and: [
        { createdAt: { $gte: start, $lt: end } },
        { creatorId: new ObjectId(creatorId) },
      ],
    })
    .then((attendance) => attendance || null);
}

export async function findAttendanceById(db, id) {
  return db
    .collection('attendance')
    .findOne({ _id: new ObjectId(id) })
    .then((attendance) => {
      return attendance || null;
    });
}

export async function findAttendanceUser(db, creatorId) {
  return db
    .collection('attendance')
    .find({ creatorId: new ObjectId(creatorId) })
    .then((attendance) => attendance || null);
}

export async function findAttendanceByCompany(
  db,
  companyId,
  startDate,
  endDate,
  limit = 10
) {
  const today = new Date();

  let start = new Date(startDate ? startDate : today);
  //   start.setDate(start.getDate() - 4);
  start.setHours(0, 0, 0, 0);

  let end = new Date(endDate ? endDate : today);
  //   end.setDate(end.getDate() - 4);
  end.setHours(23, 59, 59, 999);
  let matchQuery = {
    ...(companyId && { companyId: new ObjectId(companyId) }),
  };
  if (startDate && endDate) {
    matchQuery = { ...matchQuery, ...{ createdAt: { $gte: start, $lt: end } } };
  }
  return db
    .collection('attendance')
    .aggregate([
      {
        $match: matchQuery,
      },
      { $sort: { _id: 1 } },
      { $limit: limit },
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

export async function updateAttendanceById(db, id, data) {
  return db
    .collection('attendance')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data }
      //   { returnDocument: 'after' }
    )
    .then(({ value }) => value);
}

export async function insertAttendance(
  db,
  { status, overtimeNotes, businessTrip = '', creatorId, companyId }
) {
  const attend = {
    status,
    overtimeNotes,
    businessTrip,
    updateAt: new Date(),
    createdAt: new Date(),
    creatorId: new ObjectId(creatorId),
    companyId: new ObjectId(companyId),
  };
  const { insertedId } = await db
    .collection('attendance')
    .insertOne({ ...attend });
  attend._id = insertedId;
  return attend;
}
