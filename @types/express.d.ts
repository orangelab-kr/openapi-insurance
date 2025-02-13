import { InsuranceModel } from '@prisma/client';
import 'express';
import { InternalPlatformAccessKey } from 'openapi-internal-sdk';

declare global {
  namespace Express {
    interface Request {
      permissionIds: string[];
      loggined: {
        insurance?: InsuranceModel;
        platform: InternalPlatform;
        accessKey?: InternalPlatformAccessKey;
        user?: InternalPlatformUser;
      };
      internal: {
        sub: string;
        iss: string;
        aud: string;
        prs: boolean[];
        iat: Date;
        exp: Date;
        insurance: InsuranceModel;
      };
    }
  }
}
