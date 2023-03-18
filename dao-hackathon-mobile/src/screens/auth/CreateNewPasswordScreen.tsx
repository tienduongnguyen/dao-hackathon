import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { LoadingProgress, WCheckBox, WInput, WText } from '@components-old';
import { useIsFocused } from '@react-navigation/native';
import { NETWORK } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import WView from '@src/components/WView';
import {
  Block,
  FooterWithIndicator,
  HeaderUnAuthentication,
  Screen,
  Spacer,
} from '@src/library/components';
import { navigate } from '@src/navigation/navigation-service';
import { UN_AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions } from '@src/redux';
import { addAccount, getBalance } from '@src/services';
import { callAPIHook, checkValidPassword, Database } from '@src/utils';

import { useAuthStyle } from './styles';

const CreateNewPasswordScreen = (props: any) => {
  //state
  const { styles } = useAuthStyle();
  const { type } = props.route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const isPasswordError = !checkValidPassword(password);
  const isConfirmPasswordError =
    !checkValidPassword(confirmPassword) || password !== confirmPassword;

  //func
  const isValid =
    isCheck &&
    password !== '' &&
    !isPasswordError &&
    password === confirmPassword;
  const callGetBalanceAPI = async (address: string) => {
    const res = await callAPIHook({
      API: getBalance,
      setLoading: setIsLoading,
      payload: { address },
    });
    actions(ACTION.SET_BALANCE)(res.data);
  };

  const handleAddAccount = useCallback(async (mnemonic, wallets) => {
    const tokenFCM = await getDeviceToken();

    if (mnemonic && tokenFCM) {
      const payload = {
        mnemonic,
        wallets,
        tokenFCM,
        typeNetwork: NETWORK.sol,
      };

      callAPIHook({
        API: addAccount,
        payload,
        headers: {
          'network-type': NETWORK.sol,
        },
        onSuccess: async res => {
          console.log({ resCreateAccount: res });
        },
      });
    }
  }, []);

  const onPressCreatePassword = async () => {
    setIsLoading(true);
    await Database.clearMnemonic();
    const { address, privateKey, mnemonic } = props.route.params;
    await callGetBalanceAPI(address);
    await Database.saveMnemonic(mnemonic);
    await handleAddAccount(mnemonic, [{ address, private_key: privateKey }]);
    await Database.importPrivateKey(
      address,
      privateKey,
      'Wallet 1',
      true,
      NETWORK.sol,
    );
    await Database.setSelectAddress(address, 'sol');
    await Database.savePassword(password);
    await Database.setLoginTime();
    actions(ACTION.SET_CURRENT_RECEIVE)(0);
    setIsLoading(false);

    if (type === 'import') {
      navigate(UN_AUTHORIZE_STACK.IMPORT_SUCCESS);
    } else {
      navigate(UN_AUTHORIZE_STACK.CREATE_SUCCESS);
    }
  };
  const onPressCheck = () => {
    setIsCheck(!isCheck);
  };
  const errorMessagePassword = (data = 'password') => {
    if (data === 'password') {
      if (password.length > 0 && password.length < 8) {
        return 'Password must have more than 8 characters';
      }
      if (isPasswordError) {
        return 'Password must contain either Lowercase letter, Uppercase letter and number';
      }
    } else {
      if (isConfirmPasswordError) {
        if (confirmPassword.length > 0 && confirmPassword.length < 8) {
          return 'Password must have more than 8 characters';
        }
        if (password !== confirmPassword) {
          return 'Password does not match';
        }
        return 'Password must contain either Lowercase letter, Uppercase letter and number';
      }
    }
    return '';
  };
  const [isKeyboardShow, setKeyboardShow] = useState(false);

  const onKeyboardShow = () => {
    setKeyboardShow(true);
  };
  const onKeyboardHide = () => {
    setKeyboardShow(false);
  };

  const isFocused = useIsFocused();
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

  //render
  return (
    <Screen statusBarStyle="light-content">
      {isLoading && <LoadingProgress />}
      <HeaderUnAuthentication headerTitle="Create a password for your account" />
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Block block paddingHorizontal={16}>
          <Spacer height={40} />
          <WInput
            useEye
            isError={
              isPasswordError || (password.length > 0 && password.length < 8)
            }
            value={password}
            onChangeText={setPassword}
            errorMessage={errorMessagePassword('password')}
            placeholder="Password"
          />
          <Spacer height={24} />
          <WInput
            useEye
            isError={isConfirmPasswordError && confirmPassword.length > 0}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            errorMessage={errorMessagePassword('confirm-password')}
            placeholder="Confirm Password"
          />
          <TouchableOpacity onPress={onPressCheck}>
            <WView
              flexDirection="row"
              alignItems="center"
              marginTop={20}
              marginStart={5}
            >
              <WCheckBox isCheck={isCheck} onPress={onPressCheck} />
              <WText
                style={styles.newPasswordPressText}
                children={'I agree to the Terms of Service'}
              />
            </WView>
          </TouchableOpacity>
        </Block>
      </TouchableWithoutFeedback>
      {!isKeyboardShow && (
        <FooterWithIndicator
          current={1}
          btnLabel={'Next'}
          isValid={isValid}
          onPress={onPressCreatePassword}
        />
      )}
    </Screen>
  );
};

export default CreateNewPasswordScreen;
