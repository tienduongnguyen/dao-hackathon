/* eslint-disable @typescript-eslint/ban-types */
import React, { LegacyRef } from 'react';
import {
  ScrollViewProps,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { FastImageProps } from 'react-native-fast-image';

import { fonts } from '@src/constants';

export interface EmptyProps {
  sourceImage?: string;
  description?: string;
  onRefresh?: () => void;
  marginTop?: number | string;
}
export type AvatarProps = FastImageProps & {
  onPress?: any;
  radius?: any;
  containerStyle?: StyleProp<ViewStyle>;
  error?: any;
  disabled?: any;
};
export interface CustomProps {
  icon: any;
}
export type Props = CustomProps & TextInputProps;

export interface ErrorProps {
  reload?: () => void;
}
export interface ModalConfirmProps {
  isVisible: boolean;
  setClose: () => void;
  time?: number;
  content?: string;
  setConfirm?: () => void;
}
export interface ModalViewProps {
  isVisible: boolean;
  backdrop?: boolean;
  hideCloseButton?: boolean;
  setClose: (e: any) => void;
  onModalHide?: () => void;
  contentView: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}
export interface PopupProps {
  title: string;
  isShow: boolean;
  height?: number | string;
  onPressClose: () => void;
  content: React.ReactNode;
  image?: boolean;
}
export interface DatePickerProps {
  date: Date;
  minimumDate?: Date;
  title?: string;
  error?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onDateChange: (date: Date) => void;
}

export interface GradientProps {
  colors?: (string | number)[];
}

export interface RadioButtonProps {
  text?: string;
  description?: string;
  isSelect?: boolean;
  onPress?: () => void;
}
export interface WViewTypes {
  children?: React.ReactNode;
}

type fontKeys = keyof typeof fonts;
export interface WTextTypes {
  font?: fontKeys;
  children?: React.ReactNode;
  color?: string;
}

export interface DropdownProps {
  data: [];
  value?: string;
  title?: string;
  error?: string;
  disabled?: boolean;
  onSelect?: (value: string, index: number) => void;
}

export interface ScreenComponentProps {
  isLoading?: boolean;
  isError?: object | boolean;
  back?: boolean;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  titleHeader?: string;
  reload?: () => void;
  onBack?: () => void;
  dialogLoading?: boolean;
  unsafe?: boolean;
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
  children?: React.ReactNode;
  popupFullscreen?: PopupProps;
  image?: boolean;
}

export interface HeaderProps {
  color?: string;
  back?: boolean;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  titleHeader?: string;
  onBack?: () => void;
}

export interface BackButtonProps {
  style?: ViewStyle;
  onBack?: () => void;
}

export interface CustomInputProps {
  note?: boolean;
  phone?: boolean;
  font?: fontKeys;
  containerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  child?: any;
  prefix?: string;
  isError?: boolean;
  errorMessage?: string;
  refInput?: LegacyRef<TextInput>;
  useEye?: boolean;
}

export interface PolkadotProps {
  current: number;
  total?: number;
}

export interface WScrollTabBar {
  children: any[];
}
