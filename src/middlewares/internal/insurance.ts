import { WrapperCallback, Insurance, RESULT, Wrapper } from '../..';

export function InternalInsuranceMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      params: { insuranceId },
    } = req;

    if (!insuranceId) throw RESULT.CANNOT_FIND_INSURANCE();
    const insurance = await Insurance.getInsuranceOrThrow(insuranceId);
    req.internal.insurance = insurance;
    next();
  });
}
