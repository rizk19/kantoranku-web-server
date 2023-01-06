import { findPhotosByFileName, findAndDeletePhotosByName } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const img = await findPhotosByFileName(db, req.query.filename);
  let data = { ...img };
  if (data && Object.keys(data) && Object.keys(data).length > 0) {
    data.url = `${process.env.WEB_URI}api/img/${data.filename}`;
    data.dataurl = `${process.env.WEB_URI}api/imgdata/${data.filename}`;
    res.json({ img: data });
  } else {
    res.json({ data: 'Data not found' });
  }
});

handler.delete(async (req, res) => {
  const db = await getMongoDb();
  const imgDelete = await findAndDeletePhotosByName(db, req.query.filename);
  let data = { ...imgDelete };
  data.url = `${process.env.WEB_URI}api/img/${data.filename}`;
  data.dataurl = `${process.env.WEB_URI}api/imgdata/${data.filename}`;
  res.json({ message: 'Successfully deleted', img: data });
});

export default handler;
