import got, { Got } from 'got';

import { InsuranceModel } from '.prisma/client';
import InternalError from '../tools/error';
import dayjs from 'dayjs';
import { lookupAddress } from '../tools/location';

export class Mertizfire {
  private static got?: Got;

  public static async start(props: {
    insuranceId: string;
    userId: string;
    kickboardCode: string;
    phone: string;
    latitude: number;
    longitude: number;
  }): Promise<void> {
    const {
      insuranceId,
      userId,
      kickboardCode,
      phone,
      latitude,
      longitude,
    } = props;

    const ride_type = '5';
    const biz_driving_id = insuranceId.substr(0, 30);
    const biz_user_id = userId.substr(0, 20);
    const bike_id = kickboardCode.padEnd(10, '_').toUpperCase();
    const client_cell = phone.substr(phone.length - 4);
    const start_address = await lookupAddress({ latitude, longitude });
    const driving_start_datetime = this.getCurrentTime();
    const client = this.getClient();
    await client({
      url: 'driving_bike_log/',
      method: 'POST',
      json: {
        ride_type,
        biz_driving_id,
        biz_user_id,
        bike_id,
        client_cell,
        start_address,
        driving_start_datetime,
      },
    }).json();
  }

  public static async end(insurance: InsuranceModel): Promise<void> {
    const { insuranceId } = insurance;
    const biz_driving_id = insuranceId.substr(0, 30);
    const driving_finish_datetime = this.getCurrentTime();
    const client = this.getClient();
    await client({
      url: `driving_bike_log/${biz_driving_id}/`,
      method: 'POST',
      json: { driving_finish_datetime },
    }).json();
  }

  public static async cancel(
    insurance: InsuranceModel,
    reason: string
  ): Promise<void> {
    const { insuranceId } = insurance;
    const biz_driving_id = insuranceId.substr(0, 30);
    const client = this.getClient();
    await client({
      url: `driving_bike_log/${biz_driving_id}/cancel/`,
      method: 'POST',
      json: { description: reason },
    }).json();
  }

  public static getCurrentTime(date = dayjs()): string {
    return date.format('YYYYMMDDHHmmss');
  }

  public static getClient(): Got {
    if (this.got) return this.got;
    const token = process.env.MERTIZFIRE_TOKEN;
    if (!token) throw new InternalError('메리츠 화재 보험 토큰이 없습니다.');
    this.got = got.extend({
      prefixUrl: 'https://zet.itechs.io/api',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return this.got;
  }
}
