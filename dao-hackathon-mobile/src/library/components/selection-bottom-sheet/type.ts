import { ImageTypes } from '@src/assets/image';
import { NetworkType } from '@src/common';

export interface Option {
  id: string;
  label: string;
  img: ImageTypes;
  network: NetworkType;
  callback?: (network?: NetworkType) => void;
}

export interface SelectionItemProps {
  item: Option;
}
