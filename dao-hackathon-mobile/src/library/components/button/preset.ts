import { StyleSheet } from 'react-native';

import { sizeScale } from '@common';

export const stylesView = StyleSheet.create({
  primary: {
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: sizeScale(1),
    borderColor: 'transparent',
  },
  large: {
    paddingVertical: sizeScale(16),
    paddingHorizontal: sizeScale(24),
  },
  medium: { paddingVertical: sizeScale(10), paddingHorizontal: sizeScale(20) },

  small: { paddingVertical: sizeScale(10), paddingHorizontal: sizeScale(18) },

  outline: {
    borderRadius: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: sizeScale(1),
  },
  default: {},
  disable: {
    opacity: 0.5,
  },
});

export type ButtonPresetNames = 'primary' | 'outline' | 'default';
export type ButtonTypePresetNames = 'large' | 'medium' | 'small';
