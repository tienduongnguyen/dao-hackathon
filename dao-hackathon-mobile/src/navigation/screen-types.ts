import { ImageSourcePropType } from 'react-native';

import { NetworkType } from '@src/common';
import { NFTCardProps } from '@src/screens/main/stack/nft/nft-scan/nft-scan-1-side/listing/type';
import { ItemNotificationParams } from '@src/screens/main/tab-feed/notifications/type';

/* eslint-disable no-shadow */
export enum APP_SCREEN {
  UN_AUTHORIZE = 'UN_AUTHORIZE',
  AUTHORIZE = 'AUTHORIZE',
  BOTTOM_TAB = 'BOTTOM_TAB',
  SPLASH = 'SPLASH',
  DRAWER = 'DRAWER',
}

export enum COMMON_STACK {
  SELECT_REGION = 'SELECT_REGION',
  SELECT_GENDER = 'SELECT_GENDER',
  SELECT_LANGUAGE = 'SELECT_LANGUAGE',
  POPUP_WEB_VIEW = 'POPUP_WEB_VIEW',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

export enum AUTHORIZE_STACK {
  IMAGE_VIEW = 'IMAGE_VIEW',
  BOTTOM_TAB = 'BOTTOM_TAB',
  ADDRESS = 'ADDRESS',
  ADDRESS_DETAIL = 'ADDRESS_DETAIL',
  CREATE_ADDRESS = 'CREATE_ADDRESS',
  IMPORT_ADDRESS = 'IMPORT_ADDRESS',
  MINT_NFT_MANUAL = 'MINT_NFT_MANUAL',
  MINT_NFT_SCAN = 'MINT_NFT_SCAN',
  NFT_DETAIL = 'NFT_DETAIL',
  PREVIEW_SCREEN = 'PREVIEW_SCREEN',
  QR_CODE_TRANSFER = 'QR_CODE_TRANSFER',
  SUCCESS = 'SUCCESS',
  TRANSFER = 'TRANSFER',
  SELECT_NFT = 'SELECT_NFT',
  DEPOSIT = 'DEPOSIT',
  CAPTURE_IMAGE = 'CAPTURE_IMAGE',
  LISTING_CARD_ONE_SIDE = 'LISTING_CARD_ONE_SIDE',
  RENAME_CARD_ONE_SIDE = 'RENAME_CARD_ONE_SIDE',
  TAKE_PHOTO_ONE_SIDE = 'TAKE_PHOTO_ONE_SIDE',
  TAKE_PHOTO_TWO_SIDE = 'TAKE_PHOTO_TWO_SIDE',
  RENAME_TWO_SIDE = 'RENAME_TWO_SIDE',
  SHAKE = 'SHAKE',
  CUSTOMIZE_STACK = 'CUSTOMIZE_STACK',
  IMAGE_LIBRARY = 'IMAGE_LIBRARY',
  NOTIFICATION = 'NOTIFICATION',
  NOTIFICATION_DETAIL = 'NOTIFICATION_DETAIL',
}

export enum UN_AUTHORIZE_STACK {
  LOGIN = 'LOGIN',
  IMPORT_WALLET = 'IMPORT_WALLET',
  IMPORT_SUCCESS = 'IMPORT_SUCCESS',
  ENTER_PASSWORD = 'ENTER_PASSWORD',
  CREATE_SUCCESS = 'CREATE_SUCCESS',
  CREATE_WALLET = 'CREATE_WALLET',
  CREATE_PASSWORD = 'CREATE_PASSWORD',
}

export enum BOTTOM_STACK {
  FEED_STACK = 'FEED_STACK',
  NFT_STACK = 'NFT_STACK',
  QR_STACK = 'QR_STACK',
  WALLET_STACK = 'WALLET_STACK',
  MY_PAGE_STACK = 'MY_PAGE_STACK',
}

export enum FEED_STACK {
  FEED = 'FEED',
}

export enum NFT_STACK {
  NFT = 'NFT',
}

export enum QR_STACK {
  QR = 'QR',
}

export enum WALLET_STACK {
  WALLET = 'WALLET',
}

export enum MY_PAGE_STACK {
  MY_PAGE = 'MY_PAGE',
}

export enum CUSTOMIZE_STACK {
  CHOOSE_ORIENTATION = 'CHOOSE_ORIENTATION',
  DESIGN_CARD = 'DESIGN_CARD',
}

export type BottomParamsList = {
  [BOTTOM_STACK.FEED_STACK]: undefined;
  [BOTTOM_STACK.NFT_STACK]: undefined;
  [BOTTOM_STACK.QR_STACK]: undefined;
  [BOTTOM_STACK.WALLET_STACK]: undefined;
  [BOTTOM_STACK.MY_PAGE_STACK]: undefined;
};

export type FeedParamsList = {
  [FEED_STACK.FEED]: undefined;
};

export type NftParamsList = {
  [NFT_STACK.NFT]: undefined;
};

export type QRParamsList = {
  [QR_STACK.QR]: undefined;
};
export type WalletParamsList = {
  [WALLET_STACK.WALLET]: undefined;
};

export type MyPageParamsList = {
  [MY_PAGE_STACK.MY_PAGE]: undefined;
};

export type CommonParamsList = {
  [COMMON_STACK.ACCESS_DENIED]: undefined;
};

export type CustomizeParamsList = {
  [CUSTOMIZE_STACK.CHOOSE_ORIENTATION]: undefined;
  [CUSTOMIZE_STACK.DESIGN_CARD]: {
    type: '1-sided' | '2-sided';
  };
};

export type UnAuthorizeParamsList = {
  [UN_AUTHORIZE_STACK.LOGIN]: undefined;
  [UN_AUTHORIZE_STACK.IMPORT_WALLET]: undefined;
  [UN_AUTHORIZE_STACK.IMPORT_SUCCESS]: undefined;
  [UN_AUTHORIZE_STACK.ENTER_PASSWORD]: undefined;
  [UN_AUTHORIZE_STACK.CREATE_SUCCESS]: undefined;
  [UN_AUTHORIZE_STACK.CREATE_WALLET]: undefined;
  [UN_AUTHORIZE_STACK.CREATE_PASSWORD]: {
    address: any;
    privateKey: any;
    type: string;
    mnemonic: string;
  };
};

export type AuthorizeParamsList = {
  [APP_SCREEN.BOTTOM_TAB]: undefined;
  [AUTHORIZE_STACK.IMAGE_VIEW]: { url: string };
  [AUTHORIZE_STACK.ADDRESS]: undefined;
  [AUTHORIZE_STACK.IMPORT_ADDRESS]: { network: NetworkType };
  [AUTHORIZE_STACK.CREATE_ADDRESS]: { network: NetworkType };
  [AUTHORIZE_STACK.ADDRESS_DETAIL]: {
    address: string;
    walletName: string;
    network: NetworkType;
  };
  [AUTHORIZE_STACK.MINT_NFT_MANUAL]: undefined;
  [AUTHORIZE_STACK.MINT_NFT_SCAN]: undefined;
  [AUTHORIZE_STACK.NFT_DETAIL]: { token?: any; item?: any };
  [AUTHORIZE_STACK.PREVIEW_SCREEN]: { metadata?: any };
  [AUTHORIZE_STACK.QR_CODE_TRANSFER]: {
    callback?: (value: any, networkType: string) => void;
    item?: any;
  };
  [AUTHORIZE_STACK.SUCCESS]: { type: string };
  [AUTHORIZE_STACK.TRANSFER]: { item?: any };
  [AUTHORIZE_STACK.SELECT_NFT]: { address: string; networkType: NetworkType };
  [AUTHORIZE_STACK.DEPOSIT]: { logo: ImageSourcePropType };
  [AUTHORIZE_STACK.CAPTURE_IMAGE]: undefined;
  [AUTHORIZE_STACK.LISTING_CARD_ONE_SIDE]: {
    data: Array<NFTCardProps>;
    // onFilterImage: (data: Array<NFTCardProps>) => void;
  };
  [AUTHORIZE_STACK.RENAME_CARD_ONE_SIDE]: {
    data: NFTCardProps;
    onEditDetail: (
      name: string,
      description: string,
      position?: string,
    ) => void;
  };
  [AUTHORIZE_STACK.TAKE_PHOTO_ONE_SIDE]: undefined;
  [AUTHORIZE_STACK.TAKE_PHOTO_TWO_SIDE]: undefined;
  [AUTHORIZE_STACK.RENAME_TWO_SIDE]: {
    data: Array<string>;
    isOneSide?: boolean;
    isHidePopup?: boolean;
  };
  [AUTHORIZE_STACK.SHAKE]: undefined;
  [AUTHORIZE_STACK.CUSTOMIZE_STACK]: undefined;
  [AUTHORIZE_STACK.IMAGE_LIBRARY]: undefined;
  [AUTHORIZE_STACK.NOTIFICATION]: undefined;
  [AUTHORIZE_STACK.NOTIFICATION_DETAIL]: {
    item: ItemNotificationParams;
  };
};

export type RootStackParamList = {
  [APP_SCREEN.UN_AUTHORIZE]: {
    screen?: keyof typeof UN_AUTHORIZE_STACK;
    isExpired?: boolean;
  };
  [APP_SCREEN.AUTHORIZE]: undefined;
  [APP_SCREEN.SPLASH]: undefined;
} & UnAuthorizeParamsList &
  AuthorizeParamsList &
  CommonParamsList &
  NftParamsList &
  QRParamsList &
  WalletParamsList &
  BottomParamsList &
  CustomizeParamsList;
