import { ValidateProps } from '@/api-lib/constants';
import {
  findUserByEmail,
  findUserByUsername,
  insertUser,
  findUsersByCompany,
} from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import { slugUsername } from '@/lib/user';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import { ObjectId } from 'mongodb';

const handler = nc(ncOpts);

handler.use(...auths);

handler.get(async (req, res) => {
  if (!req.user) return res.json({ user: null });
  const db = await getMongoDb();
  const users = await findUsersByCompany(
    db,
    req.query.limit ? parseInt(req.query.limit, 10) : 10,
    req.user && req.user.companyId ? req.user.companyId : ''
  );
  res.json({ users });
});

handler.post(
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username,
      name: ValidateProps.user.name,
      password: ValidateProps.user.password,
      email: ValidateProps.user.email,
    },
    required: ['username', 'name', 'password', 'email'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) return res.json({ user: null });
    if (req.user && req.user.role === 'member') return res.json({ user: null });
    const db = await getMongoDb();

    let { username, name, email, password } = req.body;
    username = slugUsername(req.body.username);
    email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    if (await findUserByEmail(db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }
    if (await findUserByUsername(db, username)) {
      res
        .status(403)
        .json({ error: { message: 'The username has already been taken.' } });
      return;
    }
    const user = await insertUser(db, {
      email,
      originalPassword: password,
      bio: '',
      name,
      username,
      companyId: new ObjectId(req.user.companyId),
      role: 'member',
    });
    res.status(201).json({
      user,
    });
  }
);

export default handler;
