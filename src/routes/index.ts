import express, { Router } from 'express';
import {
  clusterInfo,
  getDebugRouter,
  getInternalRouter,
  InsuranceMiddleware,
  InternalMiddleware,
  PlatformMiddleware,
  RESULT,
  Wrapper,
} from '..';

export * from './debug';
export * from './internal';

export function getRouter(): Router {
  const router = express();

  router.use('/internal', InternalMiddleware(), getInternalRouter());
  router.use('/debug', getDebugRouter());
  router.get(
    '/:insuranceId',
    PlatformMiddleware({ permissionIds: ['insurance.view'], final: true }),
    InsuranceMiddleware(),
    Wrapper(async (req) => {
      const { insurance } = req.loggined;
      throw RESULT.SUCCESS({ details: { insurance } });
    })
  );

  router.get(
    '/',
    Wrapper(async () => {
      throw RESULT.SUCCESS({ details: clusterInfo });
    })
  );

  return router;
}
