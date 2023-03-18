import React from 'react';

import { sizeScale } from '@src/common';
import { Block, Button, Text } from '@src/library/components';
import { useMainStyle } from '@src/screens/main/style';

import { ItemCategoryProps } from '../type';

export const ItemCategory = ({ item, onPressFilter }: ItemCategoryProps) => {
  // state
  const { colors } = useMainStyle();

  // render
  return (
    <Button onPress={onPressFilter(item)}>
      <Block
        width={sizeScale(155)}
        middle
        justifyContent="center"
        borderBottomWidth={item.isSelect === true ? 3 : 0}
        borderBottomColor={
          item.isSelect === true ? colors.text3 : colors.transparent
        }
        paddingVertical={14}
      >
        <Text
          text={item.title}
          preset={'notoSanBold14'}
          colorTheme={item.isSelect ? 'white' : 'text2'}
        />
      </Block>
    </Button>
  );
};
