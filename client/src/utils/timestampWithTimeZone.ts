import { TimestampTZ } from '../model/types';

export const getTimestampWithTimeZone = (date: Date): TimestampTZ => {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';

  const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(
    2,
    '0',
  );
  const minutes = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');

  return date
    .toISOString()
    .replace('Z', `${sign}${hours}:${minutes}`) as TimestampTZ;
};
