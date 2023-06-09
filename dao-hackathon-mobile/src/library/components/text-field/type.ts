import React from 'react';
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import { UseFormTrigger } from 'react-hook-form';

import { Colors } from '@theme';

import { TextPresetNames } from '../text/preset';

export interface InputBaseProps extends TextInputProps {
  /**
   * Disable input or not
   * @default false
   */
  disabled?: boolean;

  /**
   * Input invalid or not
   * @default undefined
   */
  error?: string;

  /**
   * Label title of input
   * @default undefined
   */
  label?: string;

  /**
   * Label text using i18n
   */
  labelTx?: string;

  /**
   * Function on input change text
   * @default undefined
   */
  onTextChange?: (name?: string, value?: string) => void;

  /**
   * Call trigger react hook form
   */
  trigger?: UseFormTrigger<any>;

  /**
   * function pass to last input of form when click return key
   */
  onSubmit?: () => void;
  /**
   * function pass to last input of form when click return key
   */
  handleValue?: (val: string) => string;
  /**
   * Name to trigger
   */
  nameTrigger?: string;

  /**
   * Name of key to update object when input change text
   * @default undefined
   */
  name?: string;

  /**
   * Set default value for input
   * @default undefined
   */
  defaultValue?: string;

  /**
   * Label color when input focus
   * @default rgb(159,152,146)
   */
  activeTintLabelColor?: string;

  /**
   * Border color when input focus
   * @default rgb(159,152,146)
   */
  activeTintBorderColor?: string;

  /**
   * Label color when input blue
   * @default rgb(159,152,146)
   */
  unActiveTintLabelColor?: string;

  /**
   * Border color when input blue
   * @default rgb(159,152,146)
   */
  unActiveTintBorderColor?: string;

  /**
   * Border color when input disabled
   * @default rgb(159,152,146)
   */
  disabledBorderColor?: string;

  /**
   * Label color when input disabled
   * @default rgb(159,152,146)
   */
  disabledLabelColor?: string;

  /**
   * Input color when input disabled
   * @default rgb(159,152,146)
   */
  disabledInputColor?: string;

  /**
   * Border color when input not valid
   * @default rgb(214,45,32)
   */
  errorBorderColor?: string;

  /**
   * Label color when input not valid
   * @default rgb(214,45,32)
   */
  errorLabelColor?: string;

  /**
   * Overwrite container input style
   * @default undefined
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Overwrite input style
   * @default undefined
   */
  inputStyle?: StyleProp<TextStyle>;

  /**
   * Placeholder of input using i18n
   * @default undefined
   */
  placeholderTx?: string;

  /**
   * Placeholder of input
   * @default undefined
   */
  placeholder?: string;

  /**
   * Placeholder color
   * @default undefined
   */
  placeholderColor?: string;

  /**
   * Children left input
   */
  leftChildren?: React.ReactNode;

  /**
   * Children right input.(ex:Icon show/hide password)
   */
  rightChildren?: React.ReactNode;

  /**
   * Remove characters with regex on change text
   * @default undefined
   */
  rxRemove?: RegExp;

  labelColorTheme?: keyof Colors;

  required?: boolean;

  colorThemeRequired?: keyof Colors;

  errorColorTheme?: keyof Colors;

  labelPresets?: TextPresetNames;
}

export interface TextFieldProps extends InputBaseProps {
  /**
   * Preset of text
   * @default flat
   */
  typeInput: 'flat' | 'outline';
}
