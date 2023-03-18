import React, { memo } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import isEqual from 'react-fast-compare';

import { WViewTypes } from './type';

export type WViewProps = WViewTypes & StyleProp<ViewStyle> & ViewProps;
export default memo((props: WViewProps) => {
  //render
  return <View {...props} style={[props, props.style]} />;
}, isEqual);
