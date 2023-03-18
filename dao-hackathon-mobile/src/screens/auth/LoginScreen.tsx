// import { colors } from '@src/constants';
import React from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Block, Button, Spacer, Wallpaper } from '@src/library/components';
import { navigate } from '@src/navigation/navigation-service';
import { UN_AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { useTheme } from '@src/themes';

const LoginScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const onPressImportWallet = () => {
    navigate(UN_AUTHORIZE_STACK.IMPORT_WALLET);
  };
  const onPressCreateNewWallet = () => {
    navigate(UN_AUTHORIZE_STACK.CREATE_WALLET);
  };

  return (
    <>
      <Wallpaper />
      <Block block paddingHorizontal={16} justifyContent="flex-end">
        <Button
          onPress={onPressCreateNewWallet}
          text="Create a new account"
          preset="outline"
          borderColorTheme="white"
          buttonColorTheme={'transparent'}
          textColorTheme="white"
          typePreset="medium"
        />
        <Spacer height={24} />
        <Button
          onPress={onPressImportWallet}
          text="I already have account"
          textColorTheme="white"
          preset="primary"
          gradient={colors.gradient}
          typePreset="medium"
        />
        <Spacer height={insets.bottom + 14} />
      </Block>
    </>
  );
};

export default LoginScreen;
