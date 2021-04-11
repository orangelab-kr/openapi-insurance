import { Database } from './tools';
import getRouter from './routes';
import serverless from 'serverless-http';

Database.initPrisma();
export const handler = serverless(getRouter());
