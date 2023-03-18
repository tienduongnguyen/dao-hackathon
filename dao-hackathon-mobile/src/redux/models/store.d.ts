import { NetworkType } from '@src/common';

export interface State {
  Navigation: Navigation;
  Wallet: Wallet;
  NFT: NFT;
  History: History;
  App: AppState;
  Notification: NotificationState;
  Profile: ProfileState;
}

export interface Navigation {
  route: string;
  params: any;
}

export interface Wallet {
  data: string[];
  dataName: string[];
  dataNetwork: NetworkType[];
  error: boolean;
  isLoading: boolean;
  select: number;
  balance: number;
  address: string;
}
export interface NFT {
  data: any[];
  error: boolean;
  isLoading: boolean;
  isLoadMore: boolean;
  isLoadMoreDone: boolean;
  pageNum: number;
}

export interface History {
  dataTransfer: any[];
  dataMint: any[];
  pageMint: number;
  pageTransfer: number;
  mintLoadMore: boolean;
  transferLoadMore: boolean;
  currentReceive: number;
  error: boolean;
  isLoading: boolean;
}

export interface ActionType {
  type: string;
  payload?: any;
  params?: any;
}

export interface NFTCard {
  data: { name: string; uri: string };
  metadata: { image: string };
  mint: string;
}

export interface AppState {
  networkType: NetworkType;
  appExpired: boolean;
}

export interface NotificationState {
  data: Array<NotificationDataState>;
  metadata: Array<{
    total: number;
    page: number;
  }>;
  offset: number;
  canLoadMore: boolean;
}
export interface NotificationDataState {
  dataNotifications: Notification;
  typeNetwork: NetworkType;
  statusNotification: boolean;
}
export interface Notification {
  urlJson: string[];
  statusSeen: boolean;
  addressSent: string;
  addressReceived: string;
  timeSeen: TimeSeen;
  typeNetwork: string;
  idNotification: string;
  createdAt: Date;
  typeNotification?: string;
}

export interface TimeSeen {
  status: boolean;
  time: Date;
}
export interface Profile {
  mnemonic: string;
  tokenFCM: string;
  emailBasic: string;
  username: string;
  name: string;
  dateOfBirth: string;
  job: string;
  phoneNumber: string;
  urlAvatar: string;
  companyName: string;
  department: string;
  position: string;
  website: string;
  emailWork: string;
}
export interface ProfileState {
  profile?: Profile;
  isCreated?: boolean;
}
