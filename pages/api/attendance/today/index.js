import { ValidateProps } from '@/api-lib/constants';
import {
  updateAttendanceById,
  insertAttendance,
  findAttendanceUserToday,
  findAttendanceById,
} from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
// import { ObjectId } from 'mongodb';

const handler = nc(ncOpts);

handler.use(...auths);

// handler.get(async (req, res) => {
//   const db = await getMongoDb();
//   const attendance = await findPostsByCompany(
//     db,
//     req.query.before ? new Date(req.query.before) : undefined,
//     req.query.by,
//     req.query.limit ? parseInt(req.query.limit, 10) : undefined,
//     req.query.cp
//   );
//   res.json({ attendance });
// });
handler.put(
  validateBody({
    type: 'object',
    properties: {
      status: ValidateProps.attendance.status,
      overtimeNotes: ValidateProps.attendance.overtimeNotes,
      businessTrip: ValidateProps.attendance.businessTrip,
      _id: { type: 'string' },
    },
    required: ['status'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }
    if (!req.body._id) {
      return res.status(401).end();
    }
    const db = await getMongoDb();
    const attend = await updateAttendanceById(db, req.body._id, {
      status: req.body.status,
      overtimeNotes: req.body.overtimeNotes ? req.body.overtimeNotes : '',
      businessTrip: req.body.businessTrip ? req.body.businessTrip : '',
      creatorId: req.user._id,
      companyId: req.user.companyId,
      updateAt: new Date(),
    });
    let temp = attend;
    temp['status'] = req.body.status;
    return res.json({ attend: temp });
  }
);

handler.post(
  validateBody({
    type: 'object',
    properties: {
      status: ValidateProps.attendance.status,
      overtimeNotes: ValidateProps.attendance.overtimeNotes,
      businessTrip: ValidateProps.attendance.businessTrip,
    },
    required: ['status'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }
    const db = await getMongoDb();

    if (await findAttendanceUserToday(db, req.user._id)) {
      res.status(403).json({ error: { message: 'You already checked in.' } });
      return;
    }
    const attend = await insertAttendance(db, {
      status: req.body.status,
      overtimeNotes: '',
      businessTrip: '',
      creatorId: req.user._id,
      companyId: req.user.companyId,
    });

    return res.json({ attend });
  }
);

handler.get(async (req, res) => {
  if (!req.user)
    return (
      res
        .status(403)
        //   .json({ error: { message: 'You have not checked in today' } });
        .json({ error: { message: 'You have not logged in' } })
    );
  const db = await getMongoDb();
  if (req.query && Object.keys(req.query).length != 0 && req.query.id) {
    const attendanceById = await findAttendanceById(
      db,
      req.query.id ? req.query.id : undefined
    );
    res.json({ ...attendanceById });
  } else {
    const attendance = await findAttendanceUserToday(
      db,
      req.user._id ? req.user._id : undefined
    );
    if (attendance && Object.keys(attendance.length > 0)) {
      res.json({ ...attendance });
    } else {
      res
        .status(403)
        .json({ error: { message: 'You have not checked in today' } });
    }
  }
});

export default handler;
