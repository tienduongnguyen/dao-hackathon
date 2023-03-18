import { IconTypes } from '@assets/icon';

export interface ItemNavigatorProps {
  icon: IconTypes;
  txTitle: string;
  arrow?: boolean;
  onPress: () => void;
}
