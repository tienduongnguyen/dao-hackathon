import React, { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Source } from 'react-native-fast-image';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import R from '@src/assets/R';
import { sizeScale } from '@src/common';
import { FastImg, WText } from '@src/components';
import { Block, Text } from '@src/library/components';
import { ACTION, actions, useReducer } from '@src/redux';
import { getBalance } from '@src/services';
import { useTheme } from '@src/themes';
import { callAPIHook, getBottomSpace, isIphoneX } from '@src/utils';

import { FeedStackScreen } from './feed-stack';
import { MyPageStackScreen } from './my-page-stack';
import { NFTStackScreen } from './nft-stack';
import { QRStackScreen } from './qr-stack';
import { WalletStackScreen } from './wallet-stack';

import { BOTTOM_STACK } from '../screen-types';

const BottomTab = createBottomTabNavigator();
type iconType = {
  FEED_STACK: Source;
  NFT_STACK: Source;
  QR_STACK: Source;
  WALLET_STACK: Source;
  MY_PAGE_STACK: Source;
};
const bottomBarIcon: iconType = {
  FEED_STACK: R.images.ic_feed,
  NFT_STACK: R.images.ic_nft,
  QR_STACK: R.images.ic_qr_code,
  WALLET_STACK: R.images.ic_wallet,
  MY_PAGE_STACK: R.images.ic_profile,
};
const bottomBarIconColor: iconType = {
  FEED_STACK: R.images.ic_feed_color,
  NFT_STACK: R.images.ic_nft_color,
  QR_STACK: R.images.ic_qr_color,
  WALLET_STACK: R.images.ic_wallet_color,
  MY_PAGE_STACK: R.images.ic_profile_color,
};
const GenTitle = (route: RouteProp<ParamListBase>) => {
  switch (route.name) {
    case 'FEED_STACK':
      return 'Feed';
    case 'NFT_STACK':
      return 'NFT';
    case 'QR_STACK':
      return 'QR';
    case 'WALLET_STACK':
      return 'Wallet';
    case 'MY_PAGE_STACK':
      return 'My page';
  }
};
const GetTabBarIcon = (
  route: RouteProp<ParamListBase>,
  {
    focused,
  }: {
    focused: boolean;
    color: string;
  },
) => {
  // state
  const styles = StyleSheet.create({
    tabBar: {
      marginBottom: -getBottomSpace() + (isIphoneX() ? 15 : 0),
      alignItems: 'center',
    },
  });
  const { colors } = useTheme();
  const { name } = route;
  const iconSize = focused ? 30 : 28;
  const iconSource = focused
    ? bottomBarIconColor[name as keyof iconType]
    : bottomBarIcon[name as keyof iconType];

  const notification = useReducer(x => x.Notification);

  const badgeValue = useMemo(
    () =>
      notification.data?.filter(item => !item?.dataNotifications?.statusSeen)
        .length,
    [notification.data],
  );

  // render
  return (
    <View style={styles.tabBar}>
      <FastImg
        source={iconSource}
        tintColor={focused ? undefined : colors.white}
        style={{
          width: iconSize,
          height: iconSize,
        }}
      />
      <WText
        font="regular14"
        color={focused ? colors.primary : colors.white}
        children={GenTitle(route)}
        style={{
          marginTop: 5,
        }}
      />
      {name === 'FEED_STACK' && badgeValue > 0 && (
        <Block
          position="absolute"
          top={-3}
          right={badgeValue > 9 ? -17 : -4}
          color={'red'}
          width={badgeValue > 9 ? sizeScale(35) : sizeScale(16)}
          height={sizeScale(16)}
          borderRadius={sizeScale(16)}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            text={badgeValue > 99 ? ' 99+' : badgeValue.toString()}
            colorTheme={'white'}
            fontWeight="700"
            fontSize={13}
          />
        </Block>
      )}
    </View>
  );
};
// const socket = io(BASE_URL_WS);

let intervalGetBalance: any;

export const BottomTabScreen = () => {
  const addressReducer = useReducer(x => x.Wallet);
  const { colors } = useTheme();

  const callGetBalanceAPI = () => {
    const address = addressReducer.data[addressReducer.select];

    if (addressReducer.data.length === 0) {
      clearInterval(intervalGetBalance);
      return;
    }
    callAPIHook({
      API: getBalance,
      payload: { address },
      onSuccess: res => {
        actions(ACTION.SET_BALANCE)(res.data);
      },
    });
  };
  const reloadBalance = () => {
    intervalGetBalance = setInterval(callGetBalanceAPI, 10000);
  };

  //effect
  useEffect(() => {
    actions(ACTION.GET_ADDRESS)();
    return () => {
      clearInterval(intervalGetBalance);
    };
  }, []);

  useEffect(() => {
    const address = addressReducer.data[addressReducer.select];
    if (address) {
      // initSocket();
      actions(ACTION.GET_LIST_NFT)({
        address,
      });
      actions(ACTION.GET_HISTORY)(address);
      clearInterval(intervalGetBalance);
      callGetBalanceAPI();
      reloadBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressReducer.select]);

  // render
  return (
    <BottomTab.Navigator
      initialRouteName={BOTTOM_STACK.NFT_STACK}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: propsTabBarIcon => GetTabBarIcon(route, propsTabBarIcon),
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary4,
        tabBarStyle: {
          borderTopColor: '#4E277A',
          borderWidth: 1,
          borderColor: '#4E277A',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: colors.background_navbar,
          height:
            (isIphoneX() ? 45 : Platform.OS === 'ios' ? 75 : 70) +
            getBottomSpace(),
        },
      })}
    >
      <BottomTab.Screen
        name={BOTTOM_STACK.NFT_STACK}
        component={NFTStackScreen}
      />
      <BottomTab.Screen
        name={BOTTOM_STACK.WALLET_STACK}
        component={WalletStackScreen}
      />
      <BottomTab.Screen
        name={BOTTOM_STACK.QR_STACK}
        component={QRStackScreen}
      />
      <BottomTab.Screen
        name={BOTTOM_STACK.FEED_STACK}
        component={FeedStackScreen}
      />
      <BottomTab.Screen
        name={BOTTOM_STACK.MY_PAGE_STACK}
        component={MyPageStackScreen}
      />
    </BottomTab.Navigator>
  );
};
