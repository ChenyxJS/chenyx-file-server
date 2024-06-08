import mysql from './mysql';
import jwt from './jwt';
import uploadConfig from './upload';

const appConfig = [mysql, jwt, uploadConfig];

export default appConfig;
