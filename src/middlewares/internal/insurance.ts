import { Callback, Insurance, InternalError, OPCODE, Wrapper } from '../..';

export function InternalInsuranceMiddleware(): Callback {
  return Wrapper(async (req, res, next) => {
    const {
      params: { insuranceId },
    } = req;

    if (!insuranceId) {
      throw new InternalError(
        '해당 보험 내역을 찾을 수 없습니다.',
        OPCODE.NOT_FOUND
      );
    }

    const insurance = await Insurance.getInsuranceOrThrow(insuranceId);
    req.internal.insurance = insurance;

    next();
  });
}
