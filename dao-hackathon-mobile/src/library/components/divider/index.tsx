import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';

import { useTheme } from '@theme';

import { DividerProps } from './type';

export const Divider = (props: DividerProps) => {
  // state
  const { height = 1, colorTheme = 'background_popup', color } = props;
  const theme = useTheme();

  // style
  const divider = useMemo<ViewStyle>(
    () => ({
      width: '100%',
      height,
      backgroundColor: (colorTheme
        ? theme.colors[colorTheme]
        : color) as string,
    }),
    [color, colorTheme, height, theme.colors],
  );

  // render
  return <View style={[divider]} />;
};
