import React, { useCallback } from 'react';
import { ListRenderItemInfo } from 'react-native';

import { VectorIcon } from '@src/assets/vector-icon/vector-icon';
import { execFunc } from '@src/common';

import { LIST_COLOR } from './const';
import { styles } from './styles';
import { OptionColor, ToolbarBaseProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { ListView } from '../list-view';
import { Spacer } from '../spacer';

export const ColorToolbar = (props: ToolbarBaseProps) => {
  // state
  const { onPressDefault, onChangeColor, selected } = props;

  // function
  const onBack = () => {
    execFunc(onPressDefault);
  };

  const onPressItem = useCallback(
    (color: string) => {
      return () => {
        execFunc(onChangeColor, color);
      };
    },
    [onChangeColor],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<OptionColor>) => {
      return (
        <Button style={styles.colorItem} onPress={onPressItem(item.color)}>
          <Block
            width={24}
            height={24}
            color={item.color}
            borderRadius={100}
            borderWidth={1}
            borderColorTheme={'white'}
            opacity={selected.color === item.color ? 1 : 0.32}
          />
        </Button>
      );
    },
    [onPressItem, selected.color],
  );

  const keyExtractor = useCallback((item: OptionColor) => item.id, []);

  const renderFooter = useCallback(() => <Spacer width={32} />, []);

  // render
  return (
    <Block direction={'row'} paddingVertical={20} paddingLeft={24}>
      <VectorIcon
        icon={'bx_chevron_left'}
        colorTheme={'white'}
        onPress={onBack}
      />
      <Spacer width={16} />
      <ListView
        data={LIST_COLOR}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        canRefresh={false}
        ListFooterComponent={renderFooter}
        keyboardShouldPersistTaps={'handled'}
        showsHorizontalScrollIndicator={false}
      />
    </Block>
  );
};
