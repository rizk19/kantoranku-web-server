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

const handler = nc(ncOpts);

handler.get(...auths, async (req, res) => {
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
    required: ['password', 'email'],
    additionalProperties: true,
  }),
  ...auths,
  async (req, res) => {
    const db = await getMongoDb();

    let { username, name, email, password, companyId } = req.body;
    if (username == '' || !username) {
      username = email.split('@')[0];
    }
    if (companyId && companyId === '') {
      if (req.query.cid) {
        companyId = req.query.cid;
      }
    } else if (!companyId) {
      if (req.query.cid) {
        companyId = req.query.cid;
      }
    }
    username = slugUsername(
      req.body.username && req.body.username != ''
        ? req.body.username
        : username
    );
    email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    const userByMail = await findUserByEmail(db, email);
    if (await userByMail) {
      let data = {
        ...userByMail,
        email,
        emailVerified: false,
      };
      delete data['profilePicture'];
      if (req.query.mobile) {
        req.logIn(data, (err) => {
          if (err) throw err;
          res.status(201).json({
            user: data,
          });
        });
        return;
      } else {
        res
          .status(403)
          .json({ error: { message: 'The email has already been used.' } });
        return;
      }
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
      companyId,
      role: req.query.mobile ? 'member' : 'admin',
    });
    req.logIn(user, (err) => {
      if (err) throw err;
      res.status(201).json({
        user,
      });
    });
  }
);

export default handler;
