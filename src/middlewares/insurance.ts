import { Insurance, RESULT, Wrapper, WrapperCallback } from '..';

export function InsuranceMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      loggined: { platform },
      params: { insuranceId },
    } = req;

    if (!insuranceId) throw RESULT.CANNOT_FIND_INSURANCE();
    const platformId = platform ? platform.platformId : undefined;
    const insurance = await Insurance.getInsuranceOrThrow(
      insuranceId,
      platformId
    );

    req.loggined.insurance = insurance;
    next();
  });
}
