import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';

import isEqual from 'react-fast-compare';

import R from '@src/assets/R';

import FastImg from './FastImg';
import { useComponentsStyle } from './styles';

interface CustomProps {
  isCheck: boolean;
  onPress?: (newValue: boolean) => void;
}

export default memo((props: CustomProps) => {
  //func
  const { styles, colors } = useComponentsStyle();
  const { isCheck, onPress } = props;

  const onPressCheckBox = () => {
    if (onPress) {
      onPress(!isCheck);
    }
  };

  //render
  return (
    <TouchableOpacity
      onPress={onPressCheckBox}
      style={[
        {
          borderColor: isCheck ? colors.primary : colors.border,

          backgroundColor: isCheck ? colors.primary : undefined,
        },
        styles.checkBoxButton,
      ]}
    >
      <FastImg
        style={[
          {
            display: isCheck ? 'flex' : 'none',
          },
          styles.checkBoxImage,
        ]}
        source={R.images.ic_check}
      />
    </TouchableOpacity>
  );
}, isEqual);
