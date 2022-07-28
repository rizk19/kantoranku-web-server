import { passportExt } from '@/api-lib/auth';
import session from './session';

const auths = [session, passportExt.initialize(), passportExt.session()];

export default auths;
