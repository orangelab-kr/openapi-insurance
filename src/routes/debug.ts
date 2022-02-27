import { Router } from 'express';
import { Insurance, RESULT, Wrapper } from '..';
import { InsuranceMiddleware } from '../middlewares';

export function getDebugRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async (req) => {
      const { insuranceId } = await Insurance.start(<any>req.query);
      throw RESULT.SUCCESS({ details: { insuranceId } });
    })
  );

  router.get(
    '/:insuranceId',
    InsuranceMiddleware(),
    Wrapper(async (req) => {
      const { insurance } = req.loggined;
      if (!insurance) throw RESULT.INVALID_ERROR();
      await Insurance.end(insurance, { endedAt: new Date() });
      throw RESULT.SUCCESS();
    })
  );

  return router;
}
