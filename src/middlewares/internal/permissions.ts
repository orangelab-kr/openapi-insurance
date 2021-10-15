import { RESULT, Wrapper, WrapperCallback } from '../..';

export enum PERMISSION {
  INSURANCE_START,
  INSURANCE_END,
  INSURANCE_CANCEL,
  INSURANCE_LIST,
  INSURANCE_VIEW,
}

export function InternalPermissionMiddleware(
  permission: PERMISSION
): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    if (!req.internal.prs[permission]) {
      throw RESULT.PERMISSION_DENIED({ args: [PERMISSION[permission]] });
    }

    next();
  });
}
