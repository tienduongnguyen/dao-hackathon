import { Platform, StyleSheet } from 'react-native';

import Toast from 'react-native-toast-message';

import { NetworkType } from '@src/common';
import moment from 'moment';

import { formatDateTime } from '../math';
import { sizeScale } from '../scale';

type TypesBase =
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'number'
  | 'object'
  | 'string'
  | 'symbol'
  | 'undefined';

export const enhance = <T>(arrStyle: Array<T>) => {
  return StyleSheet.flatten<T>(arrStyle);
};

export const onCheckType = (
  source: any,
  type: TypesBase,
): source is TypesBase => {
  return typeof source === type;
};

export const propsToStyle = <T = any>(arrStyle: Array<T>) => {
  return arrStyle
    .filter(
      x => x !== undefined && !Object.values(x).some(v => v === undefined),
    )
    .reduce((prev: any, curr: any) => {
      // eslint-disable-next-line prefer-destructuring
      const firstKey = Object.keys(curr)[0];
      const firstValue = curr[firstKey];

      if (
        !['opacity', 'zIndex', 'flex'].includes(firstKey as never) &&
        typeof firstValue === 'number'
      ) {
        curr[firstKey] = sizeScale(firstValue);
      }
      return { ...prev, ...curr };
    }, {});
};

export const execFunc = <Fn extends (...args: any[]) => any>(
  func?: Fn,
  ...args: Parameters<Fn>
): ReturnType<Fn> => {
  if (onCheckType(func, 'function')) {
    return func(...args);
  }
  return undefined as ReturnType<Fn>;
};

export const isIos = Platform.OS === 'ios';

export const showErrorToast = (
  error: string,
  subError?: string,
  onPress?: () => void,
  onHide?: () => void,
) => {
  Toast.show({
    type: 'error',
    text1: error,
    text2: subError,
    topOffset: 50,
    onHide,
    onPress,
  });
};

export const showAlertSuccess = (
  title: string,
  subTitle?: string,
  onPress?: () => void,
  onHide?: () => void,
) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: subTitle,
    topOffset: 50,
    onHide,
    onPress,
  });
};

export const parseBalance = (balance: number, network: NetworkType) => {
  if (network === 'sol') {
    return balance / 10 ** 9 + Number.EPSILON;
  }
  return balance;
};

export const getDistanceFromLatLonInMeter = ({
  lat1,
  lon1,
  lat2,
  lon2,
}: {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres

  console.log({ d });

  return d / 1000;
};

export const getTimeDifference = (date: Date) => {
  const isToday = moment().isSame(moment.utc(new Date(date)).local(), 'D');
  const isInWeek = moment().isSame(moment.utc(new Date(date)).local(), 'W');
  const isYear = moment().isSame(moment.utc(new Date(date)).local(), 'y');

  // 1. 1d <Time< 7d: xxx days ago
  // 2. Time >7d (same year): May 28
  // 3. Time >7d (different year): 2021, May 28

  switch (true) {
    // 1h <Time< 24h: xxx hours ago
    case isToday:
      return formatDateTime(new Date(date), 'HH:mm');

    // 1d <Time< 7d: xxx days ago
    case isInWeek:
      return formatDateTime(new Date(date), 'ddd');

    // Time >7d: 2015, May 28
    case !isInWeek: {
      if (!isYear) {
        return formatDateTime(date, 'DD MMM yyyy');
      } else {
        return formatDateTime(new Date(date), 'MMM d');
      }
    }

    default:
      return formatDateTime(new Date(date), 'MMM d');
  }
};

export function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
