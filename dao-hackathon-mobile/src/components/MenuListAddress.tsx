import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';

import isEqual from 'react-fast-compare';

import { DrawerActions, useNavigation } from '@react-navigation/native';
import R from '@src/assets/R';

import FastImg from './FastImg';
import { useComponentsStyle } from './styles';

export default memo(() => {
  //state
  const navigation = useNavigation();

  //func
  const onPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const { styles, colors } = useComponentsStyle();

  //render
  return (
    <TouchableOpacity onPress={onPress}>
      <FastImg
        source={R.images.ic_menu}
        style={styles.menuListImage}
        tintColor={colors.white}
      />
    </TouchableOpacity>
  );
}, isEqual);
