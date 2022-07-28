import { ObjectId } from 'mongodb';
import normalizeEmail from 'validator/lib/normalizeEmail';

export async function findCompanyById(db, companyId) {
  return db
    .collection('company')
    .findOne(
      { _id: new ObjectId(companyId) },
      { projection: dbProjectionCompany() }
    )
    .then((company) => company || null);
}

export async function findCompanyByEmail(db, email) {
  email = normalizeEmail(email);
  return db
    .collection('company')
    .findOne({ email }, { projection: dbProjectionCompany() })
    .then((company) => company || null);
}

export async function findCompanyByName(db, name) {
  let abbreviationName = abbreviator(name);
  return db
    .collection('company')
    .findOne({ abbreviationName })
    .then((company) => company || null);
}

export async function updateCompanyById(db, id, data) {
  return db
    .collection('company')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then(({ value }) => value);
}

export async function insertCompany(
  db,
  { email, name, address = '', phone = '' }
) {
  const company = {
    email,
    name,
    abbreviationName: abbreviator(name),
    address,
    phone,
    createdAt: new Date(),
  };
  const { insertedId } = await db
    .collection('company')
    .insertOne({ ...company });
  company._id = insertedId;
  return company;
}

export function dbProjectionCompany(prefix = '') {
  return {
    [`${prefix}address`]: 0,
    [`${prefix}phone`]: 0,
    [`${prefix}abbreviationName`]: 0,
    [`${prefix}_id`]: 0,
    [`${prefix}createdAt`]: 0,
  };
}

function abbreviator(params) {
  return params.toLowerCase().split(' ').join('_');
}
