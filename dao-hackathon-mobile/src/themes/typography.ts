import { Platform } from 'react-native';

export const FontDefault = {
  notoSansBlack: Platform.select({
    ios: 'NotoSans-Black',
    android: 'NotoSans-Black',
  }) as string,
  notoSansBold: Platform.select({
    ios: 'NotoSans-Bold',
    android: 'NotoSans-Bold',
  }) as string,
  notoSansLight: Platform.select({
    ios: 'NotoSans-Light',
    android: 'NotoSans-Light',
  }) as string,
  notoSansMedium: Platform.select({
    ios: 'NotoSans-Medium',
    android: 'NotoSans-Medium',
  }) as string,
  notoSansRegular: Platform.select({
    ios: 'NotoSans-Regular',
    android: 'NotoSans-Regular',
  }) as string,
  notoSansSemiBold: Platform.select({
    ios: 'NotoSans-SemiBold',
    android: 'NotoSans-SemiBold',
  }) as string,
  notoSansThin: Platform.select({
    ios: 'NotoSans-Thin',
    android: 'NotoSans-Thin',
  }) as string,
};
export type FontFamily = keyof typeof FontDefault;
