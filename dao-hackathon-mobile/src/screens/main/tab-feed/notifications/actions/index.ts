import messaging from '@react-native-firebase/messaging';
import { getDeviceToken } from '@src/common/firebase/notification';
import { ACTION, actions } from '@src/redux';
import { getNotifications } from '@src/services';
import { callAPIHook } from '@src/utils';

export const handleGetNotification = async (
  offset: number,
  isRefresh = false,
) => {
  const authStatus = await messaging().requestPermission();
  const status =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  const tokenFCM = (await getDeviceToken()) || '';

  callAPIHook({
    API: getNotifications,
    payload: {
      tokenFCM,
      status,
      offset,
    },
    onSuccess: res => {
      if (res?.data && res.data?.[0]) {
        const canLoadMore = res.data?.[0]?.data?.length >= 20;

        actions(ACTION.SET_NOTIFICATION)({
          data: res.data?.[0]?.data,
          metadata: res.data?.[0]?.metadata,
          offset: canLoadMore ? offset + 1 : offset,
          isRefresh,
          canLoadMore,
        });
      }
    },
  });
};
