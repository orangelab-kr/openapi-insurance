import axios from 'axios';

export async function lookupAddress(props: {
  latitude: number;
  longitude: number;
}): Promise<string> {
  const headers = {
    'X-NCP-APIGW-API-KEY-ID': String(process.env.NCP_APIGW_API_KEY_ID),
    'X-NCP-APIGW-API-KEY': String(process.env.NCP_APIGW_API_KEY),
  };

  const params = {
    coords: `${props.longitude},${props.latitude}`,
    output: 'json',
    orders: 'addr',
  };

  const { data } = await axios.post(
    'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc',
    { headers, params }
  );

  if (data.status.code !== 0 || data.results.length <= 0) {
    return `조회 불가능한 주소(${props.latitude}, ${props.longitude})`;
  }

  const {
    region: { area1, area2, area3, area4 },
    land: { number1, number2 },
  } = data.results[0];

  let addr = area1.name;
  if (area2.name) addr += ` ${area2.name}`;
  if (area3.name) addr += ` ${area3.name}`;
  if (area4.name) addr += ` ${area4.name}`;
  if (number1) addr += ` ${number1}`;
  if (number2) addr += ` ${number2}`;
  return addr;
}
