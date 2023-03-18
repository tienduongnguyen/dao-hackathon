import { ShakeWalletType, WalletListType } from '@src/model/shake';

export interface ItemShakeProps {
  item: WalletListType;
  onPressCard: (item: ShakeWalletType) => void;
}

export type GetNearestLocationAccountType = {
  currentLocation: {
    longitude: number;
    latitude: number;
  };
  distance?: number;
};
