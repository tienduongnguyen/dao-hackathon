import React from 'react';
import { View } from 'react-native';

import { styles } from './styles';
import { ErrorInputProps } from './type';

import { Text } from '../text';

export const ErrorInput = ({ error, errorColorTheme }: ErrorInputProps) => {
  // render
  return (
    <View style={styles.wrapError}>
      <Text
        flex
        colorTheme={errorColorTheme || 'error'}
        preset="notoSanBody2Regular"
        text={error ?? ''}
      />
    </View>
  );
};
