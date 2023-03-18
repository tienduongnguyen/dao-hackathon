import React from 'react';
import { StyleProp, TouchableOpacityProps, ViewStyle } from 'react-native';

import { LinearGradientProps } from 'react-native-linear-gradient';

import { Colors } from '@theme';

import { ButtonPresetNames, ButtonTypePresetNames } from './preset';

import { TextPresetNames } from '../text/preset';

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Text which is looked up via i18n.
   * @default undefined
   */
  tx?: string;

  /**
   * Using text instead i18n
   * @default undefined
   */
  text?: string;

  /**
   * Overwrite style for button
   * @default undefined
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Preset for button
   * @default default
   */
  preset?: ButtonPresetNames;

  typePreset?: ButtonTypePresetNames;

  /**
   * Preset for text
   * @default default
   */
  textPreset?: TextPresetNames;
  /**
   * Using color for text
   * @default undefined
   */
  textColor?: string;

  /**
   * Overwrite background color with theme for text
   */
  textColorTheme?: keyof Colors;

  /**
   * Overwrite background color with theme for button
   */
  buttonColorTheme?: keyof Colors;
  /**
   * Overwrite border color with theme for button
   */
  borderColorTheme?: keyof Colors;

  gradient?: LinearGradientProps;

  /**
   * Children for button
   * @default undefined
   */
  children?: React.ReactNode;
}
