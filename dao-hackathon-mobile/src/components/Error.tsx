import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';

import R from '@src/assets/R';

import { useComponentsStyle } from './styles';
import { ErrorProps } from './type';

const Error = ({ reload }: ErrorProps) => {
  //func
  const { styles } = useComponentsStyle();

  //render
  return (
    <View style={styles.loadingContainer}>
      <FastImage source={R.images.ic_back} style={styles.image} />
      <Text style={styles.description}>{R.strings().create_account}</Text>
      <TouchableOpacity style={styles.button} onPress={reload}>
        <Text style={styles.textReload}>{'Thử lại'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Error;
