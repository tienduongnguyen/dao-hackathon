import { StyleProp, ViewStyle } from 'react-native';

import { ImageStyle } from 'react-native-fast-image';

import { ImageTypes } from '@assets/image';
import { Colors } from '@theme';

type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center';

export interface ImageProps {
  /**
   * Overwrite image style
   * @default undefined
   */
  style?: StyleProp<ImageStyle>;

  /**
   * Overwrite wrap image style
   * @default undefined
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Source image(local)
   * @default undefined
   */
  source: ImageTypes;

  /**
   * Custom resizeMode
   * @default contain
   */
  resizeMode?: ResizeMode;

  /**
   * Tint color of img
   * @default undefined
   */
  color?: string;

  /**
   * Overwrite tint color with theme
   */
  colorTheme?: keyof Colors;
}
