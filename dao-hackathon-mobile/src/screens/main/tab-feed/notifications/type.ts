import { NetworkType } from '@src/common';

export interface NotificationHeader {
  id: number;
  title: string;
  isSelect: boolean;
  type: ScreenType;
}

export interface ItemCategoryProps {
  item: NotificationHeader;
  onPressFilter: (item: NotificationHeader) => () => void;
}

export interface ItemNotificationType {
  id: string;
  title: string;
  isRead?: boolean;
  image?: string;
  subTitle?: string;
  description?: string;
  subDescription?: string;
  createdAt?: Date;
  type?: ScreenType;
  addressReceived?: string;
  addressSent?: string;
  networkType?: NetworkType;
}

export interface ItemNotificationParams extends ItemNotificationType {
  isFromNotification: boolean;
}

export interface ItemNotificationProps {
  item: ItemNotificationType;
  onPressNotification: (item: ItemNotificationType) => void;
}

export interface ListNotificationProps {
  category: Array<NotificationHeader>;
}

// eslint-disable-next-line no-shadow
export enum ScreenType {
  NFT = 'NFT',
  SOCIAL = 'SOCIAL',
}
