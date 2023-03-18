/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { Text, View } from 'react-native';

import { BarIndicator } from 'react-native-indicators';

import { useComponentsStyle } from './styles';

export default () => {
  //func
  const { styles, colors } = useComponentsStyle();

  //render
  return (
    <View style={styles.loadingProgressContainer}>
      <View style={styles.loadingProgressBox}>
        <BarIndicator color={colors.primary} />
        <Text style={styles.progressText}>{'Loading'}</Text>
      </View>
    </View>
  );
};
