import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import { Swipeable } from 'react-native-gesture-handler';

import { execFunc, onCheckType, sizeScale } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import { Block, Button, Icon, Spacer, Text } from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { ACTION, actions } from '@src/redux';
import { deleteWallet } from '@src/services';
import { useTheme } from '@src/themes';
import { callAPIHook, Database } from '@src/utils';

import { ItemAddressProps } from './type';

import { useStackStyle } from '../style';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ItemAddress = ({
  onPressItem,
  onEditPress,
  onDeletePress,
  addressReducer,
  walletAddress,
  item,
  index,
  indexOpen,
  setIndexOpen,
}: ItemAddressProps) => {
  //state
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const { styles } = useStackStyle();
  const swipeRef = useRef<Swipeable>(null);
  const [isVisible, setIsVisible] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const height = useRef(new Animated.Value(sizeScale(98))).current;
  const width = useRef(new Animated.Value(screenWidth)).current;
  const walletName = addressReducer.dataName[index];

  //func
  const handleWidth = (toValue: number) => {
    Animated.timing(width, {
      toValue: toValue,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };
  const showPopup = () => {
    if (walletAddress === item) {
      return null;
    }
    setIsVisible(true);
    Animated.timing(progress, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    handleWidth(0);
  };

  const onPressClosePopupRemoveWallet = () => {
    setIsVisible(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    handleWidth(screenWidth);
    swipeRef.current?.close();
  };

  const editItem = () => {
    if (walletAddress === item) {
      return null;
    } else {
      swipeRef.current?.close();
      execFunc(onEditPress);
    }
  };

  const deleteItem = useCallback(async () => {
    const { select } = addressReducer;

    if (walletAddress === item) {
      return null;
    } else {
      const tokenFCM = await getDeviceToken();
      const privateKey = await Database.getPrivateKey(item);
      setIsVisible(false);
      swipeRef.current?.close();
      Animated.timing(height, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
      setTimeout(() => {
        execFunc(onDeletePress, item);
        callAPIHook({
          API: deleteWallet,
          payload: { tokenFCM, address: item, privatekey: privateKey },
          onSuccess: res => {
            console.log('DeleteWallet', { res });
          },
        });
      }, 300);
      setTimeout(() => {
        if (select > index) {
          actions(ACTION.SELECT_ADDRESS)(select - 1);
        }
        height.setValue(sizeScale(98));
        width.setValue(screenWidth);
        progress.setValue(0);
      }, 500);
    }
  }, [
    addressReducer,
    height,
    index,
    item,
    onDeletePress,
    progress,
    screenWidth,
    walletAddress,
    width,
  ]);

  const renderRightActions = (
    _: Animated.AnimatedInterpolation,
    _1: Animated.AnimatedInterpolation,
  ) => {
    return (
      <Block
        style={[
          {
            flexDirection: 'row',
          },
        ]}
      >
        <Animated.View
          style={{
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [sizeScale(96), 0],
            }),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              walletAddress === item
                ? colors.disable_button
                : colors.default_button,
          }}
        >
          <Button style={styles.swipeBtn} onPress={editItem}>
            <Icon
              icon="setting"
              size={30}
              colorTheme={walletAddress === item ? 'disable_icon' : 'white'}
            />
          </Button>
        </Animated.View>
        <Animated.View
          style={[
            {
              backgroundColor:
                walletAddress === item
                  ? colors.disable_button
                  : colors.delete_button,
              justifyContent: 'center',
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [sizeScale(96), screenWidth],
              }),
            },
          ]}
        >
          <AnimatedTouchable
            style={[
              styles.swipeBtn,
              {
                left: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    (sizeScale(96) - sizeScale(30)) / 2,
                    sizeScale(16),
                  ],
                }),
              },
            ]}
            onPress={showPopup}
          >
            <Icon
              icon="delete"
              size={30}
              colorTheme={walletAddress === item ? 'disable_icon' : 'white'}
            />
          </AnimatedTouchable>
        </Animated.View>
      </Block>
    );
  };
  const onOpen = () => {
    if (setIndexOpen && onCheckType(setIndexOpen, 'function')) {
      setIndexOpen(index);
    }
  };

  //effect
  useEffect(() => {
    if (indexOpen !== index) {
      swipeRef.current?.close();
    }
  }, [index, indexOpen]);

  //render
  return (
    <>
      <Swipeable
        ref={swipeRef}
        onSwipeableWillOpen={onOpen}
        renderRightActions={renderRightActions}
      >
        <Animated.View
          style={{
            width: width,
            backgroundColor: colors.background,
            height: height,
          }}
        >
          <Spacer height={16} />
          <Button onPress={onPressItem}>
            <Block direction={'row'} width={'100%'}>
              {/* <Block width={60} height={60}>
                <Img source={networkType as ImageTypes} />
              </Block>
              <Spacer width={16} /> */}
              <Block block paddingHorizontal={16}>
                <Block
                  direction="row"
                  width={'100%'}
                  middle
                  justifyContent="space-between"
                >
                  <Block block>
                    <Text
                      text={walletName}
                      preset="notoSanBody2Regular"
                      colorTheme="primary4"
                    />
                  </Block>
                  <Spacer width={16} />
                  {walletAddress === item && (
                    <Block
                      width={53}
                      height={24}
                      borderRadius={5}
                      colorTheme="default_button"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Button>
                        <Text
                          text="Default"
                          preset="notoSanBody3Regular"
                          colorTheme="white"
                        />
                      </Button>
                    </Block>
                  )}
                </Block>
                <Spacer height={10} />
                <Block width={'100%'} paddingRight={75}>
                  <Text
                    text={`(${item})`}
                    preset="notoSanBody2Regular"
                    colorTheme="primary7"
                  />
                </Block>
                <Spacer height={12} />
              </Block>
            </Block>
          </Button>
        </Animated.View>
      </Swipeable>
      <Block block marginHorizontal={16} height={1} colorTheme="primary6" />
      <BottomSheet
        isVisible={isVisible}
        title={'Clear wallet?'}
        description={`Are you sure you want to clear ${walletName}?`}
        onClose={onPressClosePopupRemoveWallet}
        onPressCancel={onPressClosePopupRemoveWallet}
        onPressSubmit={deleteItem}
        buttonCancelText={'Cancel'}
        buttonSubmitText={'Clear'}
        animatedInDuration={200}
        animatedOutDuration={200}
        onBackdropPress={onPressClosePopupRemoveWallet}
      />
    </>
  );
};
