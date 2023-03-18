import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { ModalPickImage } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import { PortalHost } from '@src/library/components';
import { ACTION, actions } from '@src/redux';
import { MyAppTheme } from '@src/themes';
import { Database } from '@src/utils';

import { navigationRef } from './navigation-service';
import { RootNavigation } from './root-navigator';

export const AppContainer = () => {
  // func
  const getNetworkType = useCallback(async () => {
    const networkType = await Database.getNetworkType();

    actions(ACTION.SET_NETWORK_TYPE)({ networkType });
  }, []);

  // effect
  useEffect(() => {
    getNetworkType();
  }, [getNetworkType]);

  useEffect(() => {
    (async () => {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        console.log('Here');

        await messaging().registerDeviceForRemoteMessages();
      }

      const token = await getDeviceToken();
      console.log({ token });
    })();
  }, []);

  // render
  return (
    <NavigationContainer ref={navigationRef} theme={MyAppTheme.default}>
      <>
        <StatusBar translucent backgroundColor={'transparent'} />
        <>
          <RootNavigation />
          <PortalHost name={'AppModal'} />
          <ModalPickImage />
        </>
      </>
    </NavigationContainer>
  );
};
