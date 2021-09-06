import express, { Router } from 'express';
import {
  clusterInfo,
  getInternalRouter,
  InsuranceMiddleware,
  InternalMiddleware,
  OPCODE,
  PlatformMiddleware,
  Wrapper,
} from '..';

export * from './internal';

export function getRouter(): Router {
  const router = express();

  router.use('/internal', InternalMiddleware(), getInternalRouter());
  router.get(
    '/:insuranceId',
    PlatformMiddleware({ permissionIds: ['insurance.view'], final: true }),
    InsuranceMiddleware(),
    Wrapper(async (req, res) => {
      const { insurance } = req.loggined;
      res.json({ opcode: OPCODE.SUCCESS, insurance });
    })
  );

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
