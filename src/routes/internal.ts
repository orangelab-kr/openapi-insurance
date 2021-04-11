import {
  Insurance,
  InternalInsuranceMiddleware,
  InternalPermissionMiddleware,
  PERMISSION,
} from '..';
import { OPCODE, Wrapper } from '../tools';

import { Router } from 'express';

export function getInternalRouter(): Router {
  const router = Router();

  router.post(
    '/',
    InternalPermissionMiddleware(PERMISSION.INSURANCE_START),
    Wrapper(async (req, res) => {
      const { insuranceId } = await Insurance.start(req.body);
      res.json({ opcode: OPCODE.SUCCESS, insuranceId });
    })
  );

  router.get(
    '/:insuranceId',
    InternalPermissionMiddleware(PERMISSION.INSURANCE_VIEW),
    InternalInsuranceMiddleware(),
    Wrapper(async (req, res) => {
      const { insurance } = req.internal;
      res.json({ opcode: OPCODE.SUCCESS, insurance });
    })
  );

  router.patch(
    '/:insuranceId',
    InternalPermissionMiddleware(PERMISSION.INSURANCE_END),
    InternalInsuranceMiddleware(),
    Wrapper(async (req, res) => {
      await Insurance.end(req.internal.insurance);
      res.json({ opcode: OPCODE.SUCCESS });
    })
  );

  router.delete(
    '/:insuranceId',
    InternalPermissionMiddleware(PERMISSION.INSURANCE_CANCEL),
    InternalInsuranceMiddleware(),
    Wrapper(async (req, res) => {
      const { internal, body } = req;
      await Insurance.cancel(internal.insurance, body);
      res.json({ opcode: OPCODE.SUCCESS });
    })
  );
  return router;
}
