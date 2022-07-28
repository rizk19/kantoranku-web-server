import Local from 'passport-local';
import { findUserWithEmailAndPassword } from '@/api-lib/db';
import { getMongoDb } from '../mongodb';

const localStrategy = new Local.Strategy(async function (
  email,
  password,
  done
) {
  const db = await getMongoDb();
  const user = await findUserWithEmailAndPassword(db, email, password);
  if (user) {
    done(null, user);
  } else {
    done(new Error('Invalid username and password combination'));
  }
  // findUser({ username })
  //   .then((user) => {
  //     if (user && validatePassword(user, password)) {
  //       done(null, user)
  //     } else {
  //       done(new Error('Invalid username and password combination'))
  //     }
  //   })
  //   .catch((error) => {
  //     done(error)
  //   })
});

export default localStrategy;
