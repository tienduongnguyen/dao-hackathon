import React, { useMemo } from 'react';
import { Dimensions, useWindowDimensions, View, ViewStyle } from 'react-native';

import { styles } from './styles';
import { WallpaperProps } from './type';

import { Img } from '../img';

const deviceH = Dimensions.get('screen').height;

export const Wallpaper = ({ backgroundImage = 'splash' }: WallpaperProps) => {
  // state
  const { width } = useWindowDimensions();
  const containerStyle = useMemo<ViewStyle>(
    () => ({ width, height: deviceH }),
    [width],
  );

  // render
  return (
    <View pointerEvents={'none'} style={[styles.container, containerStyle]}>
      <Img source={backgroundImage} />
    </View>
  );
};
