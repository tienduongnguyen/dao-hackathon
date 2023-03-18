import React, { useMemo } from 'react';

import { ListView } from '@src/library/components';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';

import { ItemNotification } from './ItemNotification';

import { useNotification } from '../hook';
import {
  ItemNotificationType,
  ListNotificationProps,
  ScreenType,
} from '../type';

const socialMockData = [
  {
    id: 1,
    title: 'Tax Accountant',
    isRead: false,
    image: 'http://dummyimage.com/212x100.png/dddddd/000000',
    subTitle: '41-11-BF-20-D2-78',
    createdAt: '12-12-2021',
  },
  {
    id: 2,
    title: 'Quality Engineer',
    isRead: false,
    image: 'http://dummyimage.com/133x100.png/5fa2dd/ffffff',
    subTitle: '83-E2-33-40-04-75',
    createdAt: '28-07-2022',
  },
  {
    id: 3,
    title: 'Help Desk Operator',
    isRead: false,
    image: 'http://dummyimage.com/117x100.png/cc0000/ffffff',
    subTitle: 'E7-13-A5-D3-01-12',
    createdAt: '29-07-2022',
  },
  {
    id: 4,
    title: 'Senior Sales Associate',
    isRead: true,
    image: 'http://dummyimage.com/119x100.png/ff4444/ffffff',
    subTitle: '16-19-3F-B0-55-5A',
    createdAt: '17-07-2022',
  },
  {
    id: 5,
    title: 'Food Chemist',
    isRead: false,
    image: 'http://dummyimage.com/127x100.png/dddddd/000000',
    subTitle: '94-81-F8-DC-B4-76',
    createdAt: '19-06-2022',
  },
  {
    id: 6,
    title: 'GIS Technical Architect',
    isRead: true,
    image: 'http://dummyimage.com/150x100.png/dddddd/000000',
    subTitle: 'B6-54-49-C0-A4-A9',
    createdAt: '25-10-2021',
  },
  {
    id: 7,
    title: 'Account Coordinator',
    isRead: false,
    image: 'http://dummyimage.com/147x100.png/ff4444/ffffff',
    subTitle: '9F-D8-B0-82-7E-C0',
    createdAt: '20-03-2022',
  },
  {
    id: 8,
    title: 'Nuclear Power Engineer',
    isRead: false,
    image: 'http://dummyimage.com/197x100.png/ff4444/ffffff',
    subTitle: '1D-B9-67-98-E3-86',
    createdAt: '19-07-2022',
  },
  {
    id: 9,
    title: 'Help Desk Technician',
    isRead: true,
    image: 'http://dummyimage.com/229x100.png/dddddd/000000',
    subTitle: '10-72-01-FD-00-7F',
    createdAt: '06-08-2022',
  },
  {
    id: 10,
    title: 'Legal Assistant',
    isRead: false,
    image: 'http://dummyimage.com/249x100.png/dddddd/000000',
    subTitle: 'BD-30-32-CA-11-BF',
    createdAt: '25-08-2021',
  },
];

export const ListNotification = ({ category }: ListNotificationProps) => {
  // state
  const { dataNotificationNft, canLoadMore, offset, handleGetNotification } =
    useNotification();

  const data = useMemo(() => {
    return category.find(item => item.isSelect)?.type === ScreenType.SOCIAL
      ? socialMockData
      : dataNotificationNft;
  }, [category, dataNotificationNft]);

  // func
  const handleRefresh = () => {
    handleGetNotification(0, true);
  };

  const handleLoadMore = () => {
    handleGetNotification(offset, false);
  };

  const handlePressNotify = (item: ItemNotificationType) => {
    if (item.type === ScreenType.NFT) {
      navigate(AUTHORIZE_STACK.NOTIFICATION_DETAIL, {
        item: { ...item, isFromNotification: true },
      });
    }
  };

  const renderItem = ({ item }: { item: ItemNotificationType }) => {
    return (
      <ItemNotification item={item} onPressNotification={handlePressNotify} />
    );
  };

  // render
  return (
    <ListView
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      onRefresh={handleRefresh}
      canLoadMore={canLoadMore}
      onLoadMore={handleLoadMore}
    />
  );
};
