import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { BarIndicator } from 'react-native-indicators';

import { useComponentsStyle } from './styles';

const Loading = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  //func
  const { styles, colors } = useComponentsStyle();

  //render
  return (
    <View style={[styles.loadingContainer, style]}>
      <BarIndicator color={colors.primary} />
    </View>
  );
};

export default Loading;
