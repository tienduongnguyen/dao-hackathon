/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { LoadingProgress, WInput, WText } from '@components-old';
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
import { addAccount, checkValidMnemonic, generateAddress } from '@src/services';
import { callAPIHook } from '@src/utils';

import { useAuthStyle } from './styles';

const ImportWalletScreen = () => {
  //state
  const { styles, colors } = useAuthStyle();

  const MAX_MNEMONIC_LENGTH = 12;
  const listInput = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(() =>
    useState(''),
  );
  const listRef = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(() =>
    useRef<any>(),
  );
  const [isKeyboardShow, setKeyboardShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  const mnemonic = listInput.map(x => x[0]).join(' ');
  const isHaveMnemonic =
    listInput.map(x => x[0].trim()).filter(x => x !== '' && x !== undefined)
      .length === MAX_MNEMONIC_LENGTH;

  // func
  const onKeyboardShow = () => {
    setKeyboardShow(true);
  };
  const onKeyboardHide = () => {
    setKeyboardShow(false);
  };

  const onPressCreateNewWallet = () => {
    navigate(UN_AUTHORIZE_STACK.CREATE_WALLET);
  };

  const handleAddAccount = useCallback(
    async (mnemonicValue, tokenFCM, wallets) => {
      if (mnemonicValue && tokenFCM) {
        const payload = {
          mnemonic: mnemonicValue,
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
    },
    [],
  );

  const handleGenerateAddress = async (tokenFCM: string) => {
    callAPIHook({
      API: generateAddress,
      payload: {
        mnemonic: mnemonic.trim(),
        index: 0,
        tokenFCM,
      },
      onSuccess: async response => {
        const { address, privateKey } = response.data;
        await handleAddAccount(mnemonic, tokenFCM, [
          { address, private_key: privateKey },
        ]);
        navigate(UN_AUTHORIZE_STACK.CREATE_PASSWORD, {
          address,
          privateKey,
          type: 'import',
          mnemonic,
        });
      },
    });
  };

  const onPressImportWallet = async () => {
    const tokenFCM = await getDeviceToken();
    callAPIHook({
      API: checkValidMnemonic,
      setLoading: setLoading,
      payload: {
        mnemonic: mnemonic.trim(),
        tokenFCM,
      },
      onSuccess: async res => {
        if (!res.data) {
          setIsError(true);
        }
        if (res.data) {
          await handleGenerateAddress(tokenFCM ?? '');
        }
      },
    });
  };

  const onChangeText = (index: number) => (value: string) => {
    try {
      setIsError(false);
      if (value.split(' ').length === MAX_MNEMONIC_LENGTH) {
        for (let i = index; i < MAX_MNEMONIC_LENGTH; i++) {
          listInput[i][1](value.split(' ')[i - index]);
          listRef[i].current.focus();
        }
        return;
      }
      if (value.length > 50) {
        value = value.slice(0, 50);
      }
      if (value.includes(' ')) {
        if (index + 1 <= MAX_MNEMONIC_LENGTH) {
          listRef[index + 1].current.focus();
        }
        return;
      }
      if (value === '') {
        if (index - 1 >= 0) {
          listRef[index - 1].current.focus();
        }
      }

      listInput[index][1](value);
    } catch (error) {
      console.log(error);
    }
  };

  // effect

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
      <HeaderUnAuthentication
        headerTitle="Confirm Your Secret Recovery Phrase"
        subTitle="Enter you 12-word Secret Recovery Phrase"
      />
      {isLoading ? (
        <LoadingProgress />
      ) : (
        <>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={styles.importWalletContainer}
            containerStyle={styles.importWalletContainer}
          >
            <Spacer height={33} />
            <Block block paddingHorizontal={10}>
              <KeyboardAwareScrollView>
                {[1, 2, 3, 4].map((_, c) => (
                  <WView key={c} flexDirection="row">
                    {[1, 2, 3].map((index, r) => (
                      <Block block padding={5}>
                        <WInput
                          key={c * 3 + r}
                          maxLength={256}
                          isError={isError}
                          refInput={listRef[c * 3 + r]}
                          containerStyle={styles.passwordButtonText1}
                          prefix={`${c * 3 + r + 1}.`}
                          value={listInput[c * 3 + r][0]}
                          onChangeText={onChangeText(c * 3 + r)}
                        />
                      </Block>
                    ))}
                  </WView>
                ))}
                {!!isError && (
                  <WText
                    color={colors.error}
                    style={styles.importWalletText1}
                    children={
                      'The Secret Recovery Phrase is incorrect, please try again.'
                    }
                  />
                )}
              </KeyboardAwareScrollView>
            </Block>
          </TouchableWithoutFeedback>
        </>
      )}
      {!isKeyboardShow && (
        <>
          <FooterWithIndicator
            current={0}
            twoButton
            btnLabel="Next"
            secondBtnLabel="Create a new account"
            isValid={isHaveMnemonic}
            onPress={onPressImportWallet}
            onPressSecondButton={onPressCreateNewWallet}
          />
        </>
      )}
    </Screen>
  );
};

export default ImportWalletScreen;
