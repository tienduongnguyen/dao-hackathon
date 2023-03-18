import React, { useMemo } from 'react';

import { VectorIcon } from '@src/assets/vector-icon/vector-icon';
import { NETWORK } from '@src/common';

import { OptionBottomSheetProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Text } from '../text';

export const OptionBottomSheet = ({
  onPress,
  selected,
}: OptionBottomSheetProps) => {
  // state
  const label = useMemo(() => {
    switch (selected) {
      case NETWORK.sol:
        return 'Solana';

      case NETWORK.bsc:
        return 'Binance';

      case NETWORK.polygon:
        return 'Polygon';

      default:
        return 'Solana';
    }
  }, [selected]);

  // render
  return (
    <Block width={'100%'}>
      <Button onPress={onPress}>
        <Block
          direction={'row'}
          middle
          justifyContent={'space-between'}
          paddingHorizontal={12}
          paddingVertical={9}
          borderWidth={1}
          borderColorTheme={'primary6'}
        >
          <Text
            text={selected.length === 0 ? 'Select Network' : label}
            preset={'notoSanBody1Regular'}
            colorTheme={selected.length === 0 ? 'text2' : 'white'}
          />
          <VectorIcon icon={'bx_chevron_right'} colorTheme={'white'} />
        </Block>
      </Button>
    </Block>
  );
};
