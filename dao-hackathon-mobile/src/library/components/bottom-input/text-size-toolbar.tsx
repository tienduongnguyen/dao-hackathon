import React, { useCallback } from 'react';

import { VectorIcon } from '@src/assets/vector-icon/vector-icon';
import { execFunc, sizeScale } from '@src/common';

import { TEXT_SIZE } from './const';
import { OptionSize, ToolbarBaseProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Spacer } from '../spacer';
import { Text } from '../text';

export const TextSizeToolbar = (props: ToolbarBaseProps) => {
  // state
  const { onPressDefault, onChangeSize, selected } = props;

  const itemStyle = useCallback(
    (item: OptionSize) => ({
      paddingHorizontal: sizeScale(12),
      paddingVertical: sizeScale(10),
      borderColor:
        selected.fontSize === item.size ? '#ffffff70' : 'transparent',
      borderRadius: 100,
      borderWidth: 1,
    }),
    [selected.fontSize],
  );

  // function
  const onBack = () => {
    execFunc(onPressDefault);
  };

  const onPressItem = useCallback(
    (size: number) => {
      return () => {
        execFunc(onChangeSize, size);
      };
    },
    [onChangeSize],
  );

  const renderItem = useCallback(
    (item: OptionSize) => {
      return (
        <Button
          style={itemStyle(item)}
          key={item.id}
          onPress={onPressItem(item.size)}
        >
          <Text
            text={item.name}
            colorTheme={'white'}
            preset={
              selected.fontSize === item.size
                ? 'notoSanHeading6Bold'
                : 'notoSanBody1Regular'
            }
          />
        </Button>
      );
    },
    [itemStyle, onPressItem, selected.fontSize],
  );

  // render
  return (
    <Block
      direction={'row'}
      middle
      paddingTop={15}
      paddingBottom={10}
      paddingLeft={24}
      paddingRight={15}
    >
      <VectorIcon
        icon={'bx_chevron_left'}
        colorTheme={'white'}
        onPress={onBack}
      />
      <Spacer width={16} />
      <Block block direction={'row'} justifyContent={'space-between'}>
        {TEXT_SIZE.map(renderItem)}
      </Block>
    </Block>
  );
};
