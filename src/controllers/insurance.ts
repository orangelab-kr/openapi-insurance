import { InsuranceModel, InsuranceProvider } from '@prisma/client';
import { InternalError, Joi, Mertizfire, OPCODE, prisma } from '..';

export class Insurance {
  public static async start(props: {
    provider: InsuranceProvider;
    userId: string;
    platformId: string;
    kickboardCode: string;
    phone: string;
    latitude: number;
    longitude: number;
  }): Promise<InsuranceModel> {
    const scheme = Joi.object({
      provider: Joi.string().valid('mertizfire').default('mertizfire'),
      userId: Joi.string().required(),
      platformId: Joi.string().uuid().required(),
      kickboardCode: Joi.string().length(6).required(),
      phone: Joi.string()
        .regex(/^\+(\d*)$/)
        .required()
        .messages({
          'string.pattern.base': '+ 로 시작하시는 전화번호를 입력해주세요.',
        }),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    });

    const {
      provider,
      userId,
      platformId,
      kickboardCode,
      phone,
      latitude,
      longitude,
    } = await scheme.validateAsync(props);
    const insurance = await prisma.insuranceModel.create({
      data: {
        provider,
        userId,
        platformId,
        kickboardCode,
        phone,
        latitude,
        longitude,
      },
    });

    switch (provider) {
      case 'mertizfire':
        await Mertizfire.start(insurance);
        break;
    }

    return insurance;
  }

  public static async end(
    insurance: InsuranceModel,
    props: { endedAt: Date }
  ): Promise<InsuranceModel> {
    const { insuranceId, provider } = insurance;
    const schema = Joi.object({
      endedAt: Joi.date().default(new Date()).optional(),
    });

    const { endedAt } = await schema.validateAsync(props);
    const updatedInsurance = await prisma.insuranceModel.update({
      where: { insuranceId },
      data: { endedAt },
    });

    switch (provider) {
      case 'mertizfire':
        await Mertizfire.end(insurance);
        break;
    }

    return updatedInsurance;
  }

  public static async cancel(
    insurance: InsuranceModel,
    props: { reason: string }
  ): Promise<InsuranceModel> {
    const { insuranceId, provider } = insurance;
    const scheme = Joi.object({
      reason: Joi.string().default('자동 취소').optional(),
    });

    const { reason } = await scheme.validateAsync(props);
    const updatedInsurance = await prisma.insuranceModel.update({
      where: { insuranceId },
      data: { reason, canceledAt: new Date() },
    });

    switch (provider) {
      case 'mertizfire':
        await Mertizfire.cancel(insurance, reason);
        break;
    }

    return updatedInsurance;
  }

  public static async getInsuranceOrThrow(
    insuranceId: string,
    platformId?: string
  ): Promise<InsuranceModel> {
    const insurance = await Insurance.getInsurance(insuranceId, platformId);

    if (!insurance) {
      throw new InternalError(
        '해당 보험 내역을 찾을 수 없습니다.',
        OPCODE.NOT_FOUND
      );
    }

    return insurance;
  }

  public static async getInsurance(
    insuranceId: string,
    platformId?: string
  ): Promise<InsuranceModel | null> {
    const insurance = await prisma.insuranceModel.findFirst({
      where: { insuranceId, platformId },
    });

    return insurance;
  }
}
