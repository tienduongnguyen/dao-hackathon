import { CustomOmit } from '@common';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import { useDidMount } from '../hooks';

export interface RemoteNotification<T>
  extends CustomOmit<FirebaseMessagingTypes.RemoteMessage, 'data'> {
  data?: T;
}

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log('enabledNotification', enabled);
  return enabled;
};

export const getDeviceToken = async () => {
  return messaging().getToken();
};

/**
 * Notification coming when app in foreground
 */
export const useInAppNotification = <T = any>(
  callback: (remoteNotification: RemoteNotification<T>) => any,
) => {
  // effect
  useDidMount(() => {
    messaging().onMessage(
      callback as (message: FirebaseMessagingTypes.RemoteMessage) => any,
    );
  });
};

/**
 * Notification coming when app in background or quit state
 */
export const useBackgroundNotification = <T = any>(
  callback: (remoteNotification: RemoteNotification<T>) => any,
) => {
  useDidMount(() => {
    messaging().setBackgroundMessageHandler(
      callback as (message: FirebaseMessagingTypes.RemoteMessage) => any,
    );
  });
};

/**
 * User click notification when app in background
 */
export const useBackgroundOpenedNotification = <T = any>(
  callback: (remoteNotification: RemoteNotification<T>) => any,
) => {
  // effect
  useDidMount(() => {
    messaging().onNotificationOpenedApp(
      callback as (message: FirebaseMessagingTypes.RemoteMessage) => any,
    );
  });
};

/**
 * User click notification when app in killed or quit state
 */
export const useKilledOpenedNotification = <T = any>(
  callback: (remoteNotification: RemoteNotification<T> | null) => any,
) => {
  // effect
  useDidMount(() => {
    messaging()
      .getInitialNotification()
      .then(
        callback as (
          message: FirebaseMessagingTypes.RemoteMessage | null,
        ) => any,
      );
  });
};
