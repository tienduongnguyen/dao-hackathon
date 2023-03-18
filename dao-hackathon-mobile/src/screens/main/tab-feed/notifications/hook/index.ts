import { useEffect, useMemo, useState } from 'react';

import { NotificationDataState, useReducer } from '@src/redux';

import { handleGetNotification } from '../actions';
import { ItemNotificationType, ScreenType } from '../type';

export const useNotification = () => {
  // state
  const notification = useReducer(x => x.Notification);
  const wallets = useReducer(x => x.Wallet);
  const [dataNotificationNft, setDataNotificationNft] = useState<
    ItemNotificationType[]
  >([]);
  const canLoadMore = useMemo(
    () => notification?.canLoadMore,
    [notification?.canLoadMore],
  );
  const offset = useMemo(() => notification.offset, [notification.offset]);

  // effect
  useEffect(() => {
    handleGetNotification(0, true);
  }, []);

  useEffect(() => {
    if (notification?.data) {
      const data = notification?.data?.map((item: NotificationDataState) => {
        const dataNotifyItem = item.dataNotifications;

        const indexWallet = wallets.data.findIndex(
          el => el === dataNotifyItem?.addressReceived,
        );

        return {
          id: dataNotifyItem.idNotification,
          title: dataNotifyItem?.urlJson?.length + ' NFTs Received!',
          isRead: dataNotifyItem.statusSeen,
          createdAt: dataNotifyItem.createdAt,
          type:
            dataNotifyItem?.typeNotification &&
            dataNotifyItem?.typeNotification !== 'nft'
              ? ScreenType.SOCIAL
              : ScreenType.NFT,
          description: wallets.dataName[indexWallet],
          subDescription: dataNotifyItem.addressReceived,
          addressSent: dataNotifyItem.addressSent,
          addressReceived: dataNotifyItem.addressReceived,
          networkType: dataNotifyItem.typeNetwork?.slice(0, 3),
        } as ItemNotificationType;
      });

      setDataNotificationNft(data);
    }
  }, [notification?.data, wallets.data, wallets.dataName]);

  return {
    offset,
    canLoadMore,
    notification,
    dataNotificationNft,
    handleGetNotification,
  };
};
