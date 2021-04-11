import { Database } from './tools';
import getRouter from './routes';
import serverless from 'serverless-http';

Database.initPrisma();
const options = { basePath: '/v1/insurance' };
export const handler = serverless(getRouter(), options);
