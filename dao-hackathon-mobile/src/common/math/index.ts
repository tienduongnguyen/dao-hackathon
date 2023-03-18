import moment from 'moment';

import { FORMAT_DATE } from '../constant/index';

export const isNumber = (num: any): num is number => {
  return !isNaN(parseFloat(String(num)));
};
export const tryParseNumber = <T = any>(num: T): number | T => {
  if (isNumber(num)) {
    return parseFloat(String(num));
  }
  return num;
};

export const roundMaxFixed = (num: number, decimals: number): number => {
  return Number(
    Math.round(Number(String(num + 'e' + decimals))) + 'e-' + decimals,
  );
};

export const formatNumber = (num: number | string, comma = ',') => {
  if (typeof num !== 'number' && typeof num !== 'string') {
    return num;
  }
  return String(num).replace(/(\d)(?=(\d{3})+\b)/g, `$1${comma}`);
};

export const formatDateTime = (date: Date, format = FORMAT_DATE) => {
  return moment(date).format(format);
};
