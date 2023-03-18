import React from 'react';

import { Block, Icon } from '@src/library/components';

import { TrashCanProps } from '../type';

export const CAN_SIZE = 40;

export const TrashCan = ({ isHold, canDelete, onLayout }: TrashCanProps) => {
  // render
  return (
    <Block
      onLayout={onLayout}
      position={'absolute'}
      bottom={3}
      zIndex={9999}
      opacity={isHold ? 1 : 0}
      middle
      justifyContent={'center'}
      width={CAN_SIZE}
      height={CAN_SIZE}
      borderRadius={20}
      colorTheme={canDelete ? 'error' : 'white'}
      alignSelf={'center'}
    >
      <Icon icon={'trash'} colorTheme={canDelete ? 'white' : 'background'} />
    </Block>
  );
};
