import { WrapperResult, WrapperResultLazyProps } from '.';

export function $_$(
  opcode: number,
  statusCode: number,
  message?: string,
  reportable?: boolean
): (props?: WrapperResultLazyProps) => WrapperResult {
  return (lazyOptions: WrapperResultLazyProps = {}) =>
    new WrapperResult({
      opcode,
      statusCode,
      message,
      reportable,
      ...lazyOptions,
    });
}

export const RESULT = {
  /** SAME ERRORS  */
  SUCCESS: $_$(0, 200),
  REQUIRED_ACCESS_KEY: $_$(-701, 401, 'REQUIRED_ACCESS_KEY'),
  EXPIRED_ACCESS_KEY: $_$(-702, 401, 'EXPIRED_ACCESS_KEY'),
  PERMISSION_DENIED: $_$(-703, 403, 'PERMISSION_DENIED'),
  INVALID_ERROR: $_$(-704, 500, 'INVALID_ERROR', true),
  FAILED_VALIDATE: $_$(-705, 400, 'FAILED_VALIDATE'),
  INVALID_API: $_$(-706, 404, 'INVALID_API'),
  /** CUSTOM ERRORS  */
  CANNOT_FIND_INSURANCE: $_$(-707, 404, 'CANNOT_FIND_INSURANCE'),
  NOT_ENDED_INSURANCE: $_$(-708, 404, 'NOT_ENDED_INSURANCE'),
  INVALID_MERTIZFIRE_TOKEN: $_$(-709, 404, 'INVALID_MERTIZFIRE_TOKEN'),
};
