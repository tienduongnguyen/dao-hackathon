import { NetworkType } from '@src/common';

export interface Wallet {
  data: string[];
  dataName: string[];
  dataNetwork: NetworkType[];
  error?: boolean;
  isLoading?: boolean;
  select: number;
  balance: number;
}
