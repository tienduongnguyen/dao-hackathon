import React, { useCallback } from 'react';

import { VectorIcon } from '@src/assets/vector-icon/vector-icon';

import { Option, ToolbarBaseProps } from './type';

import { Block } from '../block';

export const DefaultToolbar = (props: ToolbarBaseProps) => {
  // state
  const { data, selected } = props;

  const itemStyle = useCallback(
    (item: Option) => ({
      borderColor:
        (item.icon === 'bx_bold' && selected.fontWeight === 'bold') ||
        (item.icon === 'bx_italic' && selected.fontStyle === 'italic') ||
        (item.icon === 'bx_underline' &&
          selected.textDecorationLine === 'underline')
          ? '#ffffff70'
          : 'transparent',
      borderRadius: 100,
      borderWidth: 1,
    }),
    [selected.fontStyle, selected.fontWeight, selected.textDecorationLine],
  );

  // function
  const renderItem = useCallback(
    (item: Option) => {
      return (
        <Block key={item.id} style={[itemStyle(item)]} padding={10}>
          <VectorIcon
            icon={item.icon}
            colorTheme={'white'}
            onPress={item.callback}
          />
        </Block>
      );
    },
    [itemStyle],
  );

  // render
  return (
    <Block
      direction={'row'}
      justifyContent={'space-evenly'}
      paddingVertical={10}
    >
      {(data ?? []).map(renderItem)}
    </Block>
  );
};
