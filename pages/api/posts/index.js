import { ValidateProps } from '@/api-lib/constants';
import { insertPost, findPostsByCompany } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { ObjectId } from 'mongodb';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const posts = await findPostsByCompany(
    db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined,
    req.query.cp
  );
  res.json({ posts });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.post.content,
    },
    required: ['content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();
    const post = await insertPost(db, {
      content: req.body.content,
      creatorId: req.user._id,
      companyId: new ObjectId(req.user.companyId),
    });

    return res.json({ post });
  }
);

export default handler;
