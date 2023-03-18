import { ReactNode } from 'react';
import { LayoutChangeEvent, TextStyle } from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import {
  CUSTOMIZE_STACK,
  CustomizeParamsList,
} from '@src/navigation/screen-types';
import { Colors } from '@src/themes';

export interface ImagePlaceholderProps {
  background: string;
  txType?: string;
  borderWidth?: number;
  borderColorTheme?: keyof Colors;
  colorBackground?: string;
}

export interface Description extends TextStyle {
  id: string;
  text: string;
  isShow: boolean;
}
export interface ImageType {
  id: string;
  url: string;
  isIcon?: boolean;
}

export interface OptionData {
  text: string;
  itemCallback: () => void;
}

export interface SelectBackgroundProps {
  optionsImage: Array<OptionData>;
  onPressColor: () => void;
  onPressImage?: () => void;
}

export interface ToolsProps {
  onPressBackground: () => void;
  onPressAddPhoto: () => void;
  onPressEmoji: () => void;
  onPressText: () => void;
}

export interface Layout {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface TextDescriptionProps {
  item: Description;
  onSelect: () => void;
  onToggleHold: (value: boolean) => void;
  onToggleDelete: (value: boolean) => void;
  onDelete: (deleteId: string) => void;
  trashLayout: Layout;
  layout: Layout;
  enabled: boolean;
  cardY: number;
}

export interface TrashCanProps {
  onLayout?: (event: LayoutChangeEvent) => void;
  isHold: boolean;
  canDelete: boolean;
}
export interface DragDropZoneProps {
  id: string;
  onSelect?: () => void;
  onToggleHold: (value: boolean) => void;
  onToggleDelete: (value: boolean) => void;
  onDelete: (deleteId: string) => void;
  trashLayout: Layout;
  layout: Layout;
  enabled: boolean;
  children: ReactNode | undefined;
  cardY: number;
  isIcon?: boolean;
}

export interface CardLabelProps {
  type: string;
}

export type DesignCardProps = StackScreenProps<
  CustomizeParamsList,
  CUSTOMIZE_STACK.DESIGN_CARD
>;
