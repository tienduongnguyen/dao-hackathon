import { StyleSheet } from 'react-native';

import { sizeScale } from '@common';
import { FontDefault } from '@theme/typography';
export const textPresets = StyleSheet.create({
  notoSanBold14: {
    fontFamily: FontDefault.notoSansBold,
    fontSize: sizeScale(14),
    color: '#000000',
  },
  notoSanBold36: {
    fontFamily: FontDefault.notoSansBold,
    fontSize: sizeScale(36),
    color: '#000000',
  },
  notoSanMedium14: {
    fontFamily: FontDefault.notoSansMedium,
    fontSize: sizeScale(14),
    color: '#000000',
  },
  notoSanHeading1Light: {
    fontFamily: FontDefault.notoSansLight,
    fontSize: sizeScale(40),
    color: '#000000',
  },
  notoSanHeading2Bold: {
    fontFamily: FontDefault.notoSansBold,
    fontSize: sizeScale(36),
    color: '#000000',
  },
  notoSanHeading3Bold: {
    fontFamily: FontDefault.notoSansBold,
    fontSize: sizeScale(32),
    color: '#000000',
  },
  notoSanHeading4Bold: {
    fontFamily: FontDefault.notoSansBold,
    fontSize: sizeScale(24),
    color: '#000000',
  },
  notoSanHeading5Bold: {
    fontFamily: FontDefault.notoSansBold,
    fontSize: sizeScale(20),
    color: '#000000',
  },
  notoSanHeading6Bold: {
    fontFamily: FontDefault.notoSansBold,
    fontSize: sizeScale(16),
    color: '#000000',
  },
  notoSanHeading7Regular: {
    fontFamily: FontDefault.notoSansRegular,
    fontSize: sizeScale(20),
    color: '#000000',
  },
  notoSanBody1Regular: {
    fontFamily: FontDefault.notoSansRegular,
    fontSize: sizeScale(16),
    color: '#000000',
  },
  notoSanBody2Regular: {
    fontFamily: FontDefault.notoSansRegular,
    fontSize: sizeScale(14),
    color: '#000000',
  },
  notoSanBody3Regular: {
    fontFamily: FontDefault.notoSansRegular,
    fontSize: sizeScale(12),
    color: '#000000',
  },
  notoSanBody4Regular: {
    fontFamily: FontDefault.notoSansRegular,
    fontSize: sizeScale(18),
    color: '#000000',
  },
  default: {},
  heading6: {
    fontFamily: FontDefault.notoSansRegular,
    fontSize: sizeScale(16),
    fontWeight: '700',
  },
  body1: {
    fontFamily: FontDefault.notoSansRegular,
    fontSize: sizeScale(16),
    fontWeight: '400',
  },
  body2: {
    fontFamily: FontDefault.notoSansRegular,
    fontSize: sizeScale(14),
    fontWeight: '400',
  },
});

export type TextPresetNames = keyof typeof textPresets;
