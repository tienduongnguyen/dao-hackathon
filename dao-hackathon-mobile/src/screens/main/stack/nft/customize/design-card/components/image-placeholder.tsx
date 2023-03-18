import React from 'react';
import { Image } from 'react-native';

import { Block } from '@src/library/components';

import { styles } from '../style';
import { ImagePlaceholderProps } from '../type';
// import { DragResizeContainer } from 'react-native-drag-resize';
export const ImagePlaceholder = ({
  background,
  colorBackground,
}: ImagePlaceholderProps) => {
  return (
    <Block
      width={'100%'}
      height={'100%'}
      color={colorBackground}
      overflow="hidden"
    >
      {background ? (
        <Image style={styles.image} source={{ uri: background }} />
      ) : undefined}
    </Block>
  );
};
