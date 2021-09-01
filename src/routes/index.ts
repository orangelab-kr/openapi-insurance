import express, { Router } from 'express';
import {
  clusterInfo,
  getInternalRouter,
  InternalMiddleware,
  OPCODE,
  Wrapper,
} from '..';

export * from './internal';

export function getRouter(): Router {
  const router = express();

  router.use('/internal', InternalMiddleware(), getInternalRouter());
  router.get(
    '/',
    Wrapper(async (_req, res) => {
      res.json({
        opcode: OPCODE.SUCCESS,
        ...clusterInfo,
      });
    })
  );

  return router;
}
