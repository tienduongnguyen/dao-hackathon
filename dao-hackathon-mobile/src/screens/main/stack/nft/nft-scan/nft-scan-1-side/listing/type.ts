import { StackScreenProps } from '@react-navigation/stack';
import {
  AUTHORIZE_STACK,
  AuthorizeParamsList,
} from '@src/navigation/screen-types';

export interface NFTCardProps {
  id: string;
  img: string;
  card_name: string;
  description: string;
  position?: string;
}

export interface ItemScanProps {
  item: NFTCardProps;
  onPressCard: () => void;
  onPressDelete: () => void;
}

export type ListingCardOneSideProps = StackScreenProps<
  AuthorizeParamsList,
  AUTHORIZE_STACK.LISTING_CARD_ONE_SIDE
>;
