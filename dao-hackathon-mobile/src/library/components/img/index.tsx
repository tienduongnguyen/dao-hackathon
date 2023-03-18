import React, { useMemo } from 'react';
import { StyleProp, View } from 'react-native';

import FastImage, { ImageStyle } from 'react-native-fast-image';

import { images } from '@assets/image';
import { enhance } from '@common';
import { useTheme } from '@theme';

import { ImageProps } from './type';

export const Img = ({
  color,
  source,
  colorTheme,
  containerStyle,
  style: styleOverride,
  resizeMode = 'cover',
}: ImageProps) => {
  // state
  const { colors } = useTheme();

  // style
  const style = useMemo<StyleProp<ImageStyle>>(
    () =>
      enhance([{ width: '100%', height: '100%' }, styleOverride as ImageStyle]),
    [styleOverride],
  );

  // render
  return (
    <View style={containerStyle}>
      <FastImage
        tintColor={(colorTheme ? colors[colorTheme] : color) as string}
        style={style}
        resizeMode={resizeMode}
        source={images[source ?? 'default']}
      />
    </View>
  );
};
