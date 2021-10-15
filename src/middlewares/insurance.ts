import { Insurance, RESULT, Wrapper, WrapperCallback } from '..';

export function InsuranceMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      loggined: { platform },
      params: { insuranceId },
    } = req;

    if (!insuranceId) throw RESULT.CANNOT_FIND_INSURANCE();
    const insurance = await Insurance.getInsuranceOrThrow(
      insuranceId,
      platform.platformId
    );

    req.loggined.insurance = insurance;
    next();
  });
}
