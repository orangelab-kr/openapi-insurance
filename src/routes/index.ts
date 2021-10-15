import express, { Router } from 'express';
import {
  clusterInfo,
  getInternalRouter,
  InsuranceMiddleware,
  InternalMiddleware,
  PlatformMiddleware,
  RESULT,
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
