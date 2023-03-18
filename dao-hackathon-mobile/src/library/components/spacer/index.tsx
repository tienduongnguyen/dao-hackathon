import React, { useMemo } from 'react';
import { View } from 'react-native';

import { sizeScale } from '@common';

import { SpacerProps } from './type';

export const Spacer = (props: SpacerProps) => {
  const { height = 0, width = 0 } = props;

  // style
  const actualStyle = useMemo(
    () => ({
      width: typeof width === 'number' ? sizeScale(width) : width,
      height: typeof height === 'number' ? sizeScale(height) : height,
    }),
    [height, width],
  );

  // render
  return <View style={actualStyle} />;
};
