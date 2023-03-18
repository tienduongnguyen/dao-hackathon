import { ThemeType } from '@src/themes';

import { History } from './history';
import { NFT } from './nft';
import { Wallet } from './wallet';

export interface AppState {
  isLoading: boolean;
  theme: ThemeType;
}

export interface Navigation {
  route: string;
  params: any;
}

export interface ActionType {
  type: string;
  payload?: any;
  params?: any;
}

export interface State {
  Navigation: Navigation;
  Wallet: Wallet;
  NFT: NFT;
  History: History;
}
