import React from 'react';

import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

import { colors } from '@src/constants/Theme';

import { GradientProps } from './type';

const WGradient = (props: LinearGradientProps | GradientProps) => {
  //render
  return (
    <LinearGradient
      colors={props.colors || colors.gradient}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      {...props}
    />
  );
};

export default WGradient;
