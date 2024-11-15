import {
  InternalError,
  InternalMiddleware,
  OPCODE,
  Wrapper,
  getInternalRouter,
  logger,
} from '..';
import express, { Application } from 'express';

import cors from 'cors';
import morgan from 'morgan';
import os from 'os';

export * from './internal';

export function getRouter(): Application {
  const router = express();
  InternalError.registerSentry(router);

  const hostname = os.hostname();
  const logging = morgan('common', {
    stream: { write: (str: string) => logger.info(`${str.trim()}`) },
  });

  router.use(cors());
  router.use(logging);
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  router.use('/internal', InternalMiddleware(), getInternalRouter());

  router.get(
    '/',
    Wrapper(async (_req, res) => {
      res.json({
        opcode: OPCODE.SUCCESS,
        mode: process.env.NODE_ENV,
        cluster: hostname,
      });
    })
  );

  router.all(
    '*',
    Wrapper(async () => {
      throw new InternalError('Invalid API', OPCODE.ERROR);
    })
  );

  return router;
}
