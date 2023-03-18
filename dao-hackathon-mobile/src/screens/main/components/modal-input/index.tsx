import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardEvent,
  KeyboardEventName,
  Platform,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Clipboard from '@react-native-clipboard/clipboard';
import { BOTTOM_SHEET_HEIGHT, execFunc, isIos } from '@src/common';
import { sharedTiming } from '@src/common/animated';
import { WInput } from '@src/components';
import {
  Block,
  Button,
  Divider,
  Icon,
  Spacer,
  Text,
} from '@src/library/components';
import { useTheme } from '@src/themes';

import { styles } from './styles';
import { ModalInputProps } from './type';

import { Modal } from '../../../../library/components/modal';

export const ModalInput = forwardRef(
  (
    {
      onClose,
      disabled,
      title,
      isAuth,
      onPressSubmit,
      password,
      isError,
      privateKey,
      address,
      onChangeText,
    }: ModalInputProps,
    ref,
  ) => {
    // state
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [mounted, setMounted] = useState<boolean>(false);
    const keyboardHeight = useSharedValue(insets.bottom);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // reanimated style
    const wrapStyle = useAnimatedStyle(
      () => ({
        paddingBottom: keyboardHeight.value + 10,
        backgroundColor: colors.background_popup,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }),
      [keyboardHeight.value],
    );

    // function
    const onHideModal = () => {
      setIsVisible(false);
      execFunc(onClose);
    };

    const onSetDidMount = useCallback(() => {
      setMounted(true);
      keyboardHeight.value = insets.bottom;
    }, [insets.bottom, keyboardHeight]);

    const onSetUnMount = useCallback(() => {
      keyboardHeight.value = insets.bottom;
      setMounted(false);
    }, [insets.bottom, keyboardHeight]);

    const onKeyboardShow = useCallback(
      (e: KeyboardEvent) => {
        keyboardHeight.value = sharedTiming(
          e.endCoordinates.height + (isIos ? 0 : insets.bottom),
        );
      },
      [insets.bottom, keyboardHeight],
    );

    const onKeyboardHide = useCallback(() => {
      keyboardHeight.value = sharedTiming(insets.bottom);
    }, [insets.bottom, keyboardHeight]);

    // effects
    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setIsVisible(true);
        },
        hide: () => {
          setIsVisible(false);
        },
      }),
      [],
    );

    useEffect(() => {
      if (mounted) {
        Keyboard.addListener(
          Platform.select({
            android: 'keyboardDidShow',
            ios: 'keyboardWillShow',
          }) as KeyboardEventName,
          onKeyboardShow,
        );
        Keyboard.addListener(
          Platform.select({
            android: 'keyboardDidHide',
            ios: 'keyboardWillHide',
          }) as KeyboardEventName,
          onKeyboardHide,
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    // render
    return (
      <Modal
        isVisible={isVisible}
        hasGesture={false}
        onBackdropPress={onHideModal}
        onModalShow={onSetDidMount}
        onModalHide={onSetUnMount}
        animatedIn={'slideInUp'}
        animatedOut={'slideOutDown'}
        backdropOpacity={1}
        backdropColor={'transparent'}
        onBackButtonPress={onHideModal}
        style={styles.modalContainer}
      >
        <Animated.View style={[wrapStyle]}>
          <Block
            width={'100%'}
            height={BOTTOM_SHEET_HEIGHT}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            colorTheme={'background_popup'}
          >
            <Block
              paddingVertical={18}
              direction={'row'}
              justifyContent={'space-between'}
              middle
              paddingHorizontal={16}
            >
              <Text
                text={title}
                preset={'notoSanHeading6Bold'}
                colorTheme={'white'}
              />
              <Icon onPress={onHideModal} icon={'close'} colorTheme={'white'} />
            </Block>
            <Divider colorTheme="primary6" />
            {isAuth ? (
              <>
                <Block marginTop={16} paddingHorizontal={20}>
                  <Text
                    preset={'notoSanBody2Regular'}
                    text={
                      'Enter your password to receive private key of wallet new name'
                    }
                    colorTheme="white"
                  />
                </Block>
                <Spacer height={30} />
                <WInput
                  containerStyle={styles.addressDetailInput}
                  value={password}
                  isError={isError}
                  errorStyle={styles.addressDetailError}
                  placeholder="Enter your password"
                  errorMessage="The password you entered is incorrect. Please try again."
                  onChangeText={onChangeText}
                  useEye
                />
                <Block block justifyContent="flex-end" paddingBottom={50}>
                  <Block direction="row" paddingHorizontal={16}>
                    <Block block>
                      <Button
                        disabled={disabled}
                        onPress={onPressSubmit}
                        text={'Submit'}
                        gradient={colors.gradient}
                        preset={'outline'}
                        typePreset={'medium'}
                        textColorTheme={'white'}
                      />
                    </Block>
                  </Block>
                </Block>
              </>
            ) : (
              <Block marginTop={16} paddingHorizontal={20}>
                <Text
                  textAlign="center"
                  preset={'notoSanBody2Regular'}
                  text={'Click to copy'}
                  colorTheme={'white'}
                />
                <Spacer height={20} />
                <Text
                  onPress={() => {
                    Clipboard.setString(privateKey);
                    Toast.show({
                      text1: 'Copied 🥳 your private key',
                      text2: address,
                    });
                  }}
                  preset={'notoSanBody2Regular'}
                  colorTheme={'white'}
                  children={privateKey}
                />
              </Block>
            )}
          </Block>
        </Animated.View>
      </Modal>
    );
  },
);

export type ModalInput = {
  show: () => void;
  hide: () => void;
};
