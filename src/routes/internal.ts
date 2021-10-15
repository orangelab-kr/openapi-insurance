import { Router } from 'express';
import {
  Insurance,
  InternalInsuranceMiddleware,
  InternalPermissionMiddleware,
  PERMISSION,
  RESULT,
  Wrapper,
} from '..';

export function getInternalRouter(): Router {
  const router = Router();

  router.post(
    '/',
    InternalPermissionMiddleware(PERMISSION.INSURANCE_START),
    Wrapper(async (req) => {
      const { insuranceId } = await Insurance.start(req.body);
      throw RESULT.SUCCESS({ details: { insuranceId } });
    })
  );

  router.get(
    '/:insuranceId',
    InternalPermissionMiddleware(PERMISSION.INSURANCE_VIEW),
    InternalInsuranceMiddleware(),
    Wrapper(async (req) => {
      const { insurance } = req.internal;
      throw RESULT.SUCCESS({ details: { insurance } });
    })
  );

  router.patch(
    '/:insuranceId',
    InternalPermissionMiddleware(PERMISSION.INSURANCE_END),
    InternalInsuranceMiddleware(),
    Wrapper(async (req) => {
      const { internal, body } = req;
      await Insurance.end(internal.insurance, body);
      throw RESULT.SUCCESS();
    })
  );

  router.delete(
    '/:insuranceId',
    InternalPermissionMiddleware(PERMISSION.INSURANCE_CANCEL),
    InternalInsuranceMiddleware(),
    Wrapper(async (req) => {
      const { internal, body } = req;
      await Insurance.cancel(internal.insurance, body);
      throw RESULT.SUCCESS();
    })
  );

  return router;
}
