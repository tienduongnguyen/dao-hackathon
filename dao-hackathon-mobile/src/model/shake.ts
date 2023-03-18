import { NetworkType } from '../common/constant/index';

export interface WalletListType {
  title: string;
  wallets: Array<ShakeWalletType>;
}

export type ShakeWalletType = {
  address: string;
  networkType: NetworkType;
  name: string;
};
export interface Shake {
  wallets: Array<ShakeWalletType>;
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isInShakeScreen: boolean;
  deviceName: string;
}
