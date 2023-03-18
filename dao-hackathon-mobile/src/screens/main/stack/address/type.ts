import { StackScreenProps } from '@react-navigation/stack';
import { Wallet } from '@src/model';
import {
  AUTHORIZE_STACK,
  AuthorizeParamsList,
} from '@src/navigation/screen-types';

export interface ItemAddressProps {
  onPressItem: () => void;
  onDeletePress: (item: string) => void;
  onEditPress: () => void;
  item: string;
  index: any;
  addressReducer: Wallet;
  walletAddress: string;
  indexOpen?: number;
  setIndexOpen?: (index: number) => void;
}

export type CreateAddressScreenProps = StackScreenProps<
  AuthorizeParamsList,
  AUTHORIZE_STACK.CREATE_ADDRESS
>;

export type ImportAddressScreenProps = StackScreenProps<
  AuthorizeParamsList,
  AUTHORIZE_STACK.IMPORT_ADDRESS
>;
