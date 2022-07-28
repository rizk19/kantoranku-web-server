import { findAttendanceUserToday } from '@/api-lib/db';
import { auths } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
// import { ObjectId } from 'mongodb';

const handler = nc(ncOpts);

handler.use(...auths);

handler.get(async (req, res) => {
  if (!req.user) return res.json({ user: null });
  const db = await getMongoDb();
  const attendance = await findAttendanceUserToday(
    db
    // req.query.tdy ? req.query.tdy : undefined
    // req.user._id ? req.user._id : undefined
  );
  res.json({ ...attendance });
});
// handler.get(async (req, res) => {
//   if (!req.user) return res.json({ user: null });
//   console.log('masuk req');
// //   const db = await getMongoDb();
// //   const attendance = await findAttendanceUserToday(
// //     db,
// //     req.user._id ? req.user._id : undefined,
// //     req.user.companyId ? req.user.companyId : undefined
// //   );
//   res.json({ berhasil: 'yes' });
// });
