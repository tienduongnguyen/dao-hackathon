import React, { memo } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

import isEqual from 'react-fast-compare';

import Clipboard from '@react-native-clipboard/clipboard';
import R from '@src/assets/R';
import { Button, Spacer, Text } from '@src/library/components';
import { goBack } from '@src/navigation/navigation-service';
import store from '@src/redux/store';

import FastImg from './FastImg';
import { useComponentsStyle } from './styles';
import { BackButtonProps, HeaderProps } from './type';

export const BackButton = memo((props: BackButtonProps) => {
  //func
  const { styles, colors } = useComponentsStyle();
  const { style, onBack } = props;

  //render
  return (
    <TouchableOpacity
      style={[style || styles.leftComp]}
      onPress={onBack || goBack}
    >
      <FastImg
        source={R.images.ic_back}
        style={styles.headerImage}
        tintColor={colors.white}
      />
    </TouchableOpacity>
  );
}, isEqual);

export default memo((props: HeaderProps) => {
  //func
  const { styles } = useComponentsStyle();
  const { color, back, titleHeader, rightComponent, leftComponent, onBack } =
    props;

  const onTitleHeaderPress = () => {
    if (titleHeader && store.getState().Wallet.data.length > 0) {
      Clipboard.setString(
        store.getState().Wallet.data[store.getState().Wallet.select],
      );
    }
  };

  //render
  return (
    <SafeAreaView style={styles.headerContainer}>
      {back || leftComponent ? (
        <View style={styles.headerBox}>
          {back ? (
            <BackButton onBack={onBack} />
          ) : (
            !!leftComponent && leftComponent
          )}
        </View>
      ) : (
        <Spacer width={15} />
      )}
      <Spacer width={8} />
      <View style={styles.headerBox1}>
        <Button onPress={onTitleHeaderPress}>
          <Text
            preset="notoSanHeading5Bold"
            colorTheme={!color ? 'white' : undefined}
            color={color}
            text={titleHeader}
          />
        </Button>
      </View>
      <View style={styles.headerBox2}>{rightComponent}</View>
    </SafeAreaView>
  );
}, isEqual);
