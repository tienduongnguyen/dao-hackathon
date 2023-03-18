import React from 'react';

import { execFunc } from '@src/common';

import { SelectionItemProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Img } from '../img';
import { Spacer } from '../spacer';
import { Text } from '../text';

export const SelectionItem = ({ item }: SelectionItemProps) => {
  // function
  const onPressItem = () => {
    execFunc(item.callback, item.network);
  };

  // render
  return (
    <Button onPress={onPressItem}>
      <Block
        direction={'row'}
        middle
        paddingHorizontal={16}
        paddingVertical={12}
      >
        <Block width={24} height={24}>
          <Img source={item.img} />
        </Block>
        <Spacer width={16} />
        <Text
          tx={item.label}
          preset={'notoSanBody1Regular'}
          colorTheme={'white'}
        />
      </Block>
    </Button>
  );
};
