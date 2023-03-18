import { TextStyle } from 'react-native';

import { VectorIconName } from '@src/assets/vector-icon/vector-icon';
import { Description } from '@src/screens/main/stack/nft/customize/design-card/type';

export interface BottomInputProps {
  onChangeText: (text: string) => void;
  onChangeStyle: (
    key: keyof TextStyle,
    value: number | string | undefined,
  ) => void;
  onClose?: () => void;
}

export interface TextStyleButtonProps {
  icon: VectorIconName;
  onPress: () => void;
}

export interface Option {
  id: string;
  icon: VectorIconName;
  callback: () => void;
}

export interface OptionSize {
  id: string;
  name: 'Small' | 'Regular' | 'Large';
  size: number;
}

export interface OptionColor {
  id: string;
  color: string;
}

export interface ToolbarBaseProps {
  data?: Array<Option>;
  selected: Description;
  onPressDefault?: () => void;
  onChangeColor?: (color: string) => void;
  onChangeSize?: (size: number) => void;
}

export interface ToolbarProps extends ToolbarBaseProps {
  type: 'default' | 'text-size' | 'color';
}
