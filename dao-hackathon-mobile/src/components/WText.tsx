import React, { memo } from 'react';
import { Text, TextProps } from 'react-native';

import isEqual from 'react-fast-compare';

import { colors, fonts } from '@src/constants/Theme';

import { WTextTypes } from './type';

export type WTextProps = WTextTypes & TextProps;
export default memo((props: WTextProps) => {
  //func
  const { font = 'regular16' } = props;

  //render
  return (
    <Text
      {...props}
      style={[
        { ...fonts[font], color: props.color || colors.white },
        props.style,
      ]}
    />
  );
}, isEqual);
