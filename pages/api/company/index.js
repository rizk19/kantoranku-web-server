import { ValidateProps } from '@/api-lib/constants';
import {
  findCompanyByEmail,
  insertCompany,
  findCompanyByName,
} from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

const handler = nc(ncOpts);

handler.post(
  validateBody({
    type: 'object',
    properties: {
      name: ValidateProps.company.name,
      email: ValidateProps.company.email,
    },
    required: ['name', 'email'],
    additionalProperties: false,
  }),
  ...auths,
  async (req, res) => {
    const db = await getMongoDb();

    let { name, email } = req.body;
    email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    if (await findCompanyByEmail(db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }
    if (await findCompanyByName(db, name)) {
      res.status(403).json({
        error: { message: 'Company name has already been registered.' },
      });
      return;
    }
    const company = await insertCompany(db, {
      email,
      name,
    });
    return res.json({ company });
  }
  //   async (req, res) => {
  //     if (!req.user) {
  //       return res.status(401).end();
  //     }

  //     const db = await getMongoDb();

  //     const post = await insertPost(db, {
  //       content: req.body.content,
  //       creatorId: req.user._id,
  //     });

  //     return res.json({ post });
  //   }
);

export default handler;
