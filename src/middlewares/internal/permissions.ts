import { Callback, InternalError, OPCODE, Wrapper } from '../..';

export enum PERMISSION {
  INSURANCE_START,
  INSURANCE_END,
  INSURANCE_CANCEL,
  INSURANCE_LIST,
  INSURANCE_VIEW,
}

export function InternalPermissionMiddleware(permission: PERMISSION): Callback {
  return Wrapper(async (req, res, next) => {
    if (!req.internal.prs[permission]) {
      throw new InternalError(
        `${PERMISSION[permission]} 권한이 없습니다.`,
        OPCODE.ACCESS_DENIED
      );
    }

    await next();
  });
}
