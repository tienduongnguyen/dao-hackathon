import { ImageTypes } from '@src/assets/image';
import { NetworkType } from '@src/common';

export interface PageTransferProps {
  getData: () => void;
}
export interface ButtonWalletProps {
  title: string;
  isSelect: boolean;
  onPress?: (title: string) => void;
}

export interface EnterPasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  disabled: boolean;
  onPressSubmit: () => void;
  title: string;
  password: string;
  isError: boolean;
  onChangeText: (text: string) => void;
  isAuth: boolean;
  address: string;
  privateKey: string;
}

export interface NFTListHeaderProps {
  id: number;
  text: string;
  isSelect: boolean;
  icon?: ImageTypes;
}

export interface ScanDataType {
  address: string;
  networkType: NetworkType;
}
