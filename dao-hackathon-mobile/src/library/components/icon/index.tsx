import React, { useMemo } from 'react';
import { StyleProp, TouchableOpacity } from 'react-native';

import FastImage, { ImageStyle } from 'react-native-fast-image';

import { icons } from '@assets/icon';
import { enhance } from '@common';
import { useTheme } from '@theme';

import { IconProps } from './type';

const SIZE = 24;

export const Icon = (props: IconProps) => {
  // state
  const {
    size = SIZE,
    icon,
    colorTheme,
    resizeMode = 'contain',
    onPress,
    color,
  } = props;
  const theme = useTheme();
  // style
  const style = useMemo<StyleProp<ImageStyle>>(
    () => enhance([{ width: size, height: size }]),
    [size],
  );

  // render
  return (
    <TouchableOpacity
      disabled={typeof onPress !== 'function'}
      onPress={onPress}
    >
      <FastImage
        style={style}
        tintColor={(colorTheme ? theme.colors[colorTheme] : color) as string}
        resizeMode={resizeMode}
        source={icons[icon]}
      />
    </TouchableOpacity>
  );
};
