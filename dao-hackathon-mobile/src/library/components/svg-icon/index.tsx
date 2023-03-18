import React, { createElement } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { SvgComponent } from '@assets/svgIcon';
import { useTheme } from '@theme';

import { SvgIconProps } from './type';

export const SvgIcon = ({
  source,
  color = '#000',
  size = 24,
  colorTheme,
  onPress,
}: SvgIconProps) => {
  // state
  const theme = useTheme();
  // render
  return (
    <TouchableOpacity
      disabled={typeof onPress !== 'function'}
      onPress={onPress}
    >
      {createElement(SvgComponent[source], {
        width: size,
        height: size,
        fill: (colorTheme ? theme.colors[colorTheme] : color) as string,
      })}
    </TouchableOpacity>
  );
};
