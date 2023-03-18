import { IconTypes } from '@src/assets/icon';

export interface OptionData {
  text: string;
  icon: IconTypes;
  itemCallback: () => void;
}

export interface SelectActionProps {
  option: Array<OptionData>;
}
