import { passportExt } from '@/api-lib/auth';
import { auths } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(...auths);

handler.post(passportExt.authenticate('local'), (req, res) => {
  if (req && res) {
    let tempUser = req.user;
    if (req.query && req.query.mobile) {
      delete tempUser['profilePicture'];
      delete tempUser['password'];
      res.json({ user: tempUser });
    } else {
      res.json({ user: tempUser });
    }
  }
});

handler.delete(async (req, res) => {
  await req.session.destroy();
  res.status(204).end();
});

export default handler;
