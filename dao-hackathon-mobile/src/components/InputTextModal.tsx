import React, { memo } from 'react';
import { TextInput, View } from 'react-native';

import isEqual from 'react-fast-compare';

import FastImg from './FastImg';
import { useComponentsStyle } from './styles';
import { Props } from './type';

export default memo((props: Props) => {
  //func
  const { icon } = props;
  const { styles } = useComponentsStyle();

  //render
  return (
    <View
      style={styles.textModalContainer}
      children={
        <>
          <FastImg source={icon} style={styles.modal_icon_input} />
          <TextInput {...props} style={styles.input_edit} />
        </>
      }
    />
  );
}, isEqual);
