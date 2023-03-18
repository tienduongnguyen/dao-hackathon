import { NFTCard } from '@src/redux';

export interface ItemNFTCardProps {
  item: NFTCard;
  selected: boolean;
  disable?: boolean;
  onPressItem: (i: any) => void;
}
