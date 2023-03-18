import React from 'react';
import { Image } from 'react-native';

import { Block, Button, Icon, Spacer, Text } from '@src/library/components';

import { useScanStyle } from '../styles';
import { ItemScanProps } from '../type';

export const ItemScan = ({
  item,
  onPressCard,
  onPressDelete,
}: ItemScanProps) => {
  //state
  const { styles } = useScanStyle();

  //render
  return (
    <>
      <Block
        style={styles.card}
        borderWidth={2}
        borderColorTheme={!item.card_name ? 'error' : 'transparent'}
      >
        <Button onPress={onPressCard}>
          <Block width={'100%'} height={'100%'} overflow="hidden">
            <Image
              style={styles.image}
              source={{ uri: item.img ?? '' }}
              resizeMode="contain"
            />
          </Block>
        </Button>
        <Block position="absolute" alignSelf="flex-end" top={-16} right={-16}>
          <Button onPress={onPressDelete}>
            <Icon icon="close_circle" size={32} />
          </Button>
        </Block>
        <Spacer height={8} />
        {!item.card_name && (
          <Text
            text="Please click to fill name for your name card."
            colorTheme="error"
            preset="notoSanBody2Regular"
          />
        )}
      </Block>
    </>
  );
};
