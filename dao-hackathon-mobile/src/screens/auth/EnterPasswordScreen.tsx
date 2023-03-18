import React, { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import { ScreenComponent, WInput, WText } from '@components-old';
import { useIsFocused } from '@react-navigation/native';
import WView from '@src/components/WView';
import { Block, Button } from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { navigate } from '@src/navigation/navigation-service';
import { APP_SCREEN, UN_AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions } from '@src/redux';
import { Database } from '@src/utils';

import { useAuthStyle } from './styles';

const EnterPasswordScreen = () => {
  //state
  const { styles, colors } = useAuthStyle();
  const [password, setPassword] = useState(__DEV__ ? '123456Aa' : '');
  const [isError, setError] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardShow, setKeyboardShow] = useState(false);

  const onKeyboardShow = () => {
    setKeyboardShow(true);
  };
  const onKeyboardHide = () => {
    setKeyboardShow(false);
  };

  const isFocused = useIsFocused();

  //func
  useEffect(() => {
    if (isFocused) {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          Keyboard.addListener('keyboardDidShow', onKeyboardShow);
          Keyboard.addListener('keyboardDidHide', onKeyboardHide);
        }, 100);
      }
    } else {
      if (Platform.OS === 'android') {
        Keyboard.removeAllListeners('keyboardDidShow');
        Keyboard.removeAllListeners('keyboardDidHide');
      }
    }
  }, [isFocused]);

  const onPressLogin = async () => {
    setIsLoading(true);
    const isPasswordCorrect = await Database.checkPassword(password);
    if (isPasswordCorrect) {
      await Database.setLoginTime();
      await actions(ACTION.SET_APP_EXPIRED)({ appExpired: false });
      actions(ACTION.SCREEN_NAVIGATION)({ route: APP_SCREEN.AUTHORIZE });
    } else {
      setError(true);
    }
    setIsLoading(false);
  };
  const isValidButton = password.length > 0;

  const errorMessagePassword = () => {
    if (isError) {
      return 'The password you entered is incorrect.\nPlease try again';
    }
    return '';
  };
  const onPressImport = async () => {
    navigate(UN_AUTHORIZE_STACK.IMPORT_WALLET);
  };
  const onPressReset = async () => {
    setIsShowPopup(true);
  };
  const onPressClosePopup = () => {
    setIsShowPopup(false);
  };
  const onPressConfirmReset = async () => {
    setIsShowPopup(false);
    navigate(UN_AUTHORIZE_STACK.CREATE_WALLET);
  };

  const onChangeText = (text: string) => {
    setPassword(text);
    setError(false);
  };

  //render
  return (
    <ScreenComponent
      rightComponent={<></>}
      dialogLoading={isLoading}
      titleHeader=" "
      children={
        <WView margin={15} marginTop={0} flex={1}>
          <WText
            font="bold40"
            style={styles.passwordText}
            children={'Enter your password'}
          />
          <WInput
            useEye
            placeholder="Enter your password"
            value={password}
            onChangeText={onChangeText}
            isError={isError}
            errorStyle={isError ? styles.passwordInput : {}}
            errorMessage={errorMessagePassword()}
          />

          <WView style={styles.passwordBox}>
            <Block padding={8}>
              <Button
                disabled={!isValidButton}
                onPress={onPressLogin}
                text={'Login'}
                gradient={colors.gradient}
                preset={'outline'}
                typePreset={'medium'}
                textColorTheme={'white'}
              />
            </Block>

            {!isKeyboardShow && (
              <>
                <Block padding={8}>
                  <Button
                    onPress={onPressImport}
                    text={'Forgot password'}
                    preset={'outline'}
                    typePreset={'medium'}
                    textColorTheme={'white'}
                    borderColorTheme={'white'}
                  />
                </Block>
                <Block padding={8}>
                  <Button
                    onPress={onPressReset}
                    text={'Forgot password and reset account'}
                    preset={'outline'}
                    typePreset={'medium'}
                    textColorTheme={'white'}
                    borderColorTheme={'white'}
                  />
                </Block>
              </>
            )}
          </WView>
          <BottomSheet
            isVisible={isShowPopup}
            showOnUnAuthen
            title={'Reset wallet?'}
            description={'Are you sure you want to reset your wallet?'}
            onClose={onPressClosePopup}
            onPressCancel={onPressClosePopup}
            onPressSubmit={onPressConfirmReset}
            buttonCancelText={'Cancel'}
            buttonSubmitText={'Reset'}
          />
        </WView>
      }
    />
  );
};

export default EnterPasswordScreen;
