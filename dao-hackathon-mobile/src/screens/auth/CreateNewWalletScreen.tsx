import React, { useEffect, useState } from 'react';

import Animated, { FadeOut } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { FastImg, WCheckBox, WText } from '@components-old';
import Clipboard from '@react-native-clipboard/clipboard';
import { BlurView } from '@react-native-community/blur';
import R from '@src/assets/R';
import { NETWORK } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import { isIos } from '@src/common/native-module/app-module';
import {
  Block,
  Button,
  FooterWithIndicator,
  HeaderUnAuthentication,
  Screen,
  Spacer,
} from '@src/library/components';
import { navigate } from '@src/navigation/navigation-service';
import { UN_AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { generateAddress, generateMnemonic } from '@src/services';
import { callAPIHook } from '@src/utils';

import { LoadingSkeleton } from './LoadingSkeleton';
import { useAuthStyle } from './styles';

const CreateNewWalletScreen = () => {
  //state
  const { styles, colors } = useAuthStyle();
  const [mnemonic, setMnemonic] = useState('');
  const [isShowMnemonic, setIsShowMnemonic] = useState<boolean>(false);
  const [isCheck, setIsCheck] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const isValid = mnemonic.length > 0 && isCheck;

  useEffect(() => {
    callAPIHook({
      API: generateMnemonic,
      onSuccess: res => {
        setMnemonic(res.data);
        // setLoadingSkeleton(false);
      },
    });
  }, []);

  const onPressCreateNewWallet = async () => {
    const tokenFCM = await getDeviceToken();

    callAPIHook({
      API: generateAddress,
      payload: {
        mnemonic,
        index: 0,
        tokenFCM,
      },
      headers: {
        'network-type': NETWORK.sol,
      },
      onSuccess: async res => {
        const { address, privateKey } = res.data;
        navigate(UN_AUTHORIZE_STACK.CREATE_PASSWORD, {
          address,
          privateKey,
          type: 'create',
          mnemonic,
        });
      },
    });
  };

  const onPressViewMnemonic = () => {
    setIsShowMnemonic(v => !v);
  };

  const onPressCheck = () => {
    setIsCheck(c => !c);
  };

  const onPressClipBoard = () => {
    Clipboard.setString(mnemonic);
    Toast.show({ text1: 'Copied to clipboard' });
  };

  useEffect(() => {
    setTimeout(
      () => {
        setLoadingSkeleton(false);
      },
      isIos ? 1000 : 3000,
    );
  }, []);

  return (
    <Screen statusBarStyle="light-content">
      <HeaderUnAuthentication
        headerTitle="Secret Recovery Phrase"
        subTitle="Please save the phrase because it is the ONLY way to recover your account. DO NOT share it with anyone!"
      />
      <Spacer height={40} />
      <Block block paddingHorizontal={16}>
        <Button onPress={onPressViewMnemonic} onLongPress={onPressClipBoard}>
          <Block
            width={'100%'}
            borderWidth={1}
            borderColorTheme="border_box"
            justifyContent="center"
          >
            <WText
              font="regular16"
              style={styles.newWalletText1}
              children={mnemonic.split(' ').join('         ')}
            />
            {!isShowMnemonic && (
              <>
                <BlurView
                  style={styles.blurView}
                  blurAmount={10}
                  overlayColor={colors.transparent}
                  reducedTransparencyFallbackColor="white"
                />
                <FastImg
                  style={styles.newWalletImage}
                  source={R.images.ic_eye_close}
                />
              </>
            )}
          </Block>
        </Button>
        <Spacer height={24} />
        <Block width={'100%'} direction="row">
          <WCheckBox onPress={onPressCheck} isCheck={isCheck} />
          <WText
            style={styles.newWalletText}
            children={'I saved my Secret Recovery Phrase'}
          />
        </Block>
      </Block>
      <FooterWithIndicator
        current={0}
        btnLabel={'Next'}
        isValid={isValid}
        onPress={onPressCreateNewWallet}
      />
      {loadingSkeleton && (
        <Animated.View
          exiting={FadeOut}
          style={[styles.skeleton, { backgroundColor: colors.background }]}
        >
          <LoadingSkeleton />
        </Animated.View>
      )}
    </Screen>
  );
};

export default CreateNewWalletScreen;
