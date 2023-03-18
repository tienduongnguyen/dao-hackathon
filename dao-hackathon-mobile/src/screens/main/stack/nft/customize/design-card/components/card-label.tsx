import React from 'react';

import { Block, Text } from '@src/library/components';

import { CardLabelProps } from '../type';

export const CardLabel = ({ type }: CardLabelProps) => {
  // render
  return (
    <Block
      top={8}
      left={8}
      width={46}
      height={20}
      borderRadius={5}
      middle
      justifyContent="center"
      position="absolute"
      color="rgba(56, 211, 243, 0.8)"
      zIndex={1}
      pointerEvents="none"
    >
      <Text text={type} preset="notoSanBody3Regular" colorTheme="text1" />
    </Block>
  );
};
