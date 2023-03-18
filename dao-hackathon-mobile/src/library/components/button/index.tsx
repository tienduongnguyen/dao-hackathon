import React, { useMemo } from 'react';
import { GestureResponderEvent, TouchableOpacity, View } from 'react-native';

import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

import { execFunc } from '@common';
import { useTheme } from '@theme';

import { ButtonTypePresetNames, stylesView } from './preset';
import { ButtonProps } from './type';

import { Text } from '../text';
import { TextPresetNames } from '../text/preset';

const getTextPreset = (
  preset?: ButtonTypePresetNames,
): TextPresetNames | undefined => {
  switch (preset) {
    case 'large':
    case 'medium':
      return 'notoSanBody1Regular';
    case 'small':
      return 'notoSanBody1Regular';
    default:
      return undefined;
  }
};

export const Button = ({
  tx,
  text,
  disabled,
  children,
  gradient,
  textColor,
  typePreset,
  textColorTheme,
  buttonColorTheme,
  borderColorTheme,
  preset = 'default',
  style: styleOverride = {},
  ...rest
}: ButtonProps) => {
  // state
  const { colors } = useTheme();

  // func
  const pressLocal = (event: GestureResponderEvent) => {
    execFunc(rest.onPress, event);
  };

  const longPressLocal = (event: GestureResponderEvent) => {
    execFunc(rest.onLongPress, event);
  };

  // style
  const viewStyle = useMemo(
    () => [
      stylesView[preset],
      typePreset && stylesView[typePreset],
      buttonColorTheme && {
        backgroundColor: colors[buttonColorTheme] as string,
      },
      borderColorTheme && {
        borderColor: colors[borderColorTheme] as string,
      },
      disabled && stylesView.disable,
      styleOverride,
    ],
    [
      borderColorTheme,
      buttonColorTheme,
      colors,
      disabled,
      preset,
      styleOverride,
      typePreset,
    ],
  );

  const WrapView = gradient ? LinearGradient : View;

  // render
  return (
    <TouchableOpacity
      {...rest}
      onPress={pressLocal}
      onLongPress={longPressLocal}
      disabled={disabled}
    >
      <WrapView style={viewStyle} {...(gradient as LinearGradientProps)}>
        {children || (
          <Text
            tx={tx}
            text={text}
            preset={getTextPreset(typePreset)}
            color={textColor}
            colorTheme={textColorTheme}
          />
        )}
      </WrapView>
    </TouchableOpacity>
  );
};
