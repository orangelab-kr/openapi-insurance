import { InsuranceModel } from '@prisma/client';
import axios, { Axios } from 'axios';
import dayjs from 'dayjs';
import { lookupAddress, RESULT } from '..';

export class Mertizfire {
  private static axios?: Axios;

  public static async start(insurance: InsuranceModel): Promise<void> {
    const {
      insuranceId,
      userId,
      kickboardCode,
      phone,
      latitude,
      longitude,
      startedAt,
    } = insurance;

    const ride_type = '5';
    const biz_driving_id = insuranceId.substr(0, 30);
    const biz_user_id = userId.substr(0, 20);
    const bike_id = kickboardCode.padEnd(10, '_').toUpperCase();
    const client_cell = phone.substr(phone.length - 4);
    const start_address = await lookupAddress({ latitude, longitude });
    const driving_start_datetime = this.formatDate(startedAt);
    await this.getClient().post('/driving_bike_log/', {
      ride_type,
      biz_driving_id,
      biz_user_id,
      bike_id,
      client_cell,
      start_address,
      driving_start_datetime,
    });
  }

  public static async end(insurance: InsuranceModel): Promise<void> {
    const { insuranceId, endedAt } = insurance;
    if (!endedAt) throw RESULT.NOT_ENDED_INSURANCE();
    const biz_driving_id = insuranceId.substr(0, 30);
    const driving_finish_datetime = this.formatDate(endedAt);
    await this.getClient().post(`/driving_bike_log/${biz_driving_id}/`, {
      driving_finish_datetime,
    });
  }

  public static async cancel(
    insurance: InsuranceModel,
    reason: string
  ): Promise<void> {
    const { insuranceId } = insurance;
    const biz_driving_id = insuranceId.substr(0, 30);
    await this.getClient().post(`/driving_bike_log/${biz_driving_id}/cancel/`, {
      description: reason,
    });
  }

  public static formatDate(date: Date): string {
    return dayjs(date).format('YYYYMMDDHHmmss');
  }

  public static getClient(): Axios {
    if (this.axios) return this.axios;
    const token = process.env.MERTIZFIRE_TOKEN;
    if (!token) throw RESULT.INVALID_MERTIZFIRE_TOKEN();
    this.axios = axios.create({
      baseURL: 'https://zet.itechs.io/api',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return this.axios;
  }
}
