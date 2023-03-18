import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { showAlertSuccess } from '@src/common';
import {
  requestNotificationPermission,
  useBackgroundNotification,
  useBackgroundOpenedNotification,
  useInAppNotification,
  useKilledOpenedNotification,
} from '@src/common/firebase/notification';
import { ACTION, actions } from '@src/redux';
import AddressDetailScreen from '@src/screens/main/stack/address/AddressDetailScreen';
import AddressScreen from '@src/screens/main/stack/address/AddressScreen';
import CreateAddressScreen from '@src/screens/main/stack/address/CreateAddressScreen';
import ImportAddressScreen from '@src/screens/main/stack/address/ImportAddressScreen';
import ImageViewScreen from '@src/screens/main/stack/ImageViewScreen';
import MintNftManualScreen from '@src/screens/main/stack/nft/MintNftManualScreen';
import MintNftScanScreen from '@src/screens/main/stack/nft/nft-scan';
import { ListingCardOneSideScreen } from '@src/screens/main/stack/nft/nft-scan/nft-scan-1-side/listing';
import { RenameCardOneSideScreen } from '@src/screens/main/stack/nft/nft-scan/nft-scan-1-side/rename';
import { TakePhotoOneSideScreen } from '@src/screens/main/stack/nft/nft-scan/nft-scan-1-side/take-photo';
import { RenameTwoSideScreen } from '@src/screens/main/stack/nft/nft-scan/nft-scan-2-side/rename';
import { TakePhotoTwoSideScreen } from '@src/screens/main/stack/nft/nft-scan/nft-scan-2-side/take-photo';
import NftDetailScreen from '@src/screens/main/stack/nft/NftDetailScreen';
import PreviewScreen from '@src/screens/main/stack/nft/PreviewScreen';
import QrCodeTransferScreen from '@src/screens/main/stack/nft/QrCodeTransferScreen';
import SuccessScreen from '@src/screens/main/stack/nft/SuccessScreen';
import TransferScreen from '@src/screens/main/stack/nft/TransferScreen';
import SelectNftScreen from '@src/screens/main/stack/qr/SelectNftScreen';
import { ShakeScreen } from '@src/screens/main/stack/shake';
import DepositScreen from '@src/screens/main/stack/wallet/DepositScreen';
import { NotificationDetail } from '@src/screens/main/tab-feed/notificationDetail';
import { Notification } from '@src/screens/main/tab-feed/notifications';
import { handleGetNotification } from '@src/screens/main/tab-feed/notifications/actions';
import { Database } from '@src/utils';

import { CustomizeStackScreen } from './customize-stack';
import { DrawerScreen } from './drawer-stack';

import { navigate } from '../navigation-service';
import { APP_SCREEN, AUTHORIZE_STACK } from '../screen-types';

const Main = createStackNavigator();

export const MainScreen = () => {
  //state
  const appState = useRef(AppState.currentState);

  //fuction
  const appStateListener = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const isExpired = await Database.isExpired();
      await actions(ACTION.SET_APP_EXPIRED)({ appExpired: isExpired });
      if (isExpired) {
        actions(ACTION.SCREEN_NAVIGATION)({
          route: APP_SCREEN.UN_AUTHORIZE,
          params: { isExpired: true },
        });
        navigate(APP_SCREEN.UN_AUTHORIZE, { isExpired: true });
      } else {
        actions(ACTION.SCREEN_NAVIGATION)({
          route: APP_SCREEN.AUTHORIZE,
          params: { isExpired: false },
        });
        navigate(APP_SCREEN.AUTHORIZE);
      }
    }
    appState.current = nextAppState;
  };

  const getNetworkType = useCallback(async () => {
    const selectedAddress = await Database.getSelectAddress();
    const listAddress = await Database.getAllAddress();
    const selectedIndex = await listAddress.data.findIndex(
      (item: any) => item.address === selectedAddress,
    );

    await Database.setSelectAddress(
      selectedAddress ?? '',
      listAddress.data[selectedIndex]?.networkType,
    );
    setTimeout(() => {
      actions(ACTION.SET_CURRENT_RECEIVE)(0);
      actions(ACTION.SELECT_ADDRESS)(selectedIndex);
    }, 100);
  }, []);

  // effect
  useInAppNotification(async data => {
    showAlertSuccess(
      data?.notification?.title || ' ',
      data?.notification?.body || ' ',
      () =>
        navigate(AUTHORIZE_STACK.NOTIFICATION_DETAIL, {
          item: {
            id: data?.data?.id,
            title: data?.data?.title,
            isFromNotification: true,
          },
        }),
    );

    handleGetNotification(0, true);
  });
  useBackgroundNotification(() => {
    console.log('Here is background notification');
  });
  useBackgroundOpenedNotification(notification => {
    if (notification) {
      navigate(AUTHORIZE_STACK.NOTIFICATION_DETAIL, {
        item: {
          id: notification?.data?.id,
          title: notification?.data?.title,
          isFromNotification: true,
        },
      });
    }
  });
  useKilledOpenedNotification(notification => {
    if (notification) {
      navigate(AUTHORIZE_STACK.NOTIFICATION_DETAIL, {
        item: {
          id: notification?.data?.id,
          title: notification?.data?.title,
          isFromNotification: true,
        },
      });
    }
  });

  useEffect(() => {
    getNetworkType();
  }, [getNetworkType]);

  useEffect(() => {
    handleGetNotification(0, true);
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', appStateListener);
    return () => {
      AppState.removeEventListener('change', appStateListener);
    };
  }, []);

  //render
  return (
    <Main.Navigator
      // initialRouteName={AUTHORIZE_STACK.LISTING_CARD_ONE_SIDE}
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Main.Screen
        options={{ headerShown: false }}
        name={APP_SCREEN.DRAWER}
        component={DrawerScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.ADDRESS}
        component={AddressScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.ADDRESS_DETAIL}
        component={AddressDetailScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.CREATE_ADDRESS}
        component={CreateAddressScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.IMPORT_ADDRESS}
        component={ImportAddressScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.MINT_NFT_MANUAL}
        component={MintNftManualScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.MINT_NFT_SCAN}
        component={MintNftScanScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.NFT_DETAIL}
        component={NftDetailScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.PREVIEW_SCREEN}
        component={PreviewScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.QR_CODE_TRANSFER}
        component={QrCodeTransferScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.SUCCESS}
        component={SuccessScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.TRANSFER}
        component={TransferScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.SELECT_NFT}
        component={SelectNftScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.DEPOSIT}
        component={DepositScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.IMAGE_VIEW}
        component={ImageViewScreen}
      />

      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.LISTING_CARD_ONE_SIDE}
        component={ListingCardOneSideScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.RENAME_CARD_ONE_SIDE}
        component={RenameCardOneSideScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.RENAME_TWO_SIDE}
        component={RenameTwoSideScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.TAKE_PHOTO_ONE_SIDE}
        component={TakePhotoOneSideScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.TAKE_PHOTO_TWO_SIDE}
        component={TakePhotoTwoSideScreen}
      />
      <Main.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={AUTHORIZE_STACK.CUSTOMIZE_STACK}
        component={CustomizeStackScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.SHAKE}
        component={ShakeScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.NOTIFICATION}
        component={Notification}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name={AUTHORIZE_STACK.NOTIFICATION_DETAIL}
        component={NotificationDetail}
      />
    </Main.Navigator>
  );
};
