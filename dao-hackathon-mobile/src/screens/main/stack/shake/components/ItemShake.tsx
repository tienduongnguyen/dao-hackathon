import React, { useCallback } from 'react';

import { ImageTypes } from '@src/assets/image';
import { Block, Button, Img, Spacer, Text } from '@src/library/components';
import { ShakeWalletType } from '@src/model/shake';
import { useTheme } from '@theme';

import { ItemShakeProps } from '../type';

export const ItemShake = ({ item, onPressCard }: ItemShakeProps) => {
  // state

  const theme = useTheme();

  //function
  const onPress = useCallback(
    (value: ShakeWalletType) => () => {
      onPressCard(value);
    },
    [onPressCard],
  );

  const renderWalletItem = useCallback(
    (element: ShakeWalletType) => (
      <React.Fragment key={element.address}>
        <Button onPress={onPress(element)}>
          <Block
            direction="row"
            middle
            paddingBottom={10}
            borderBottomColor={theme.colors.primary}
            borderBottomWidth={0.5}
            marginBottom={10}
          >
            <Block height={60} width={60} borderRadius={30} overflow="hidden">
              <Img source={element.networkType as ImageTypes} />
            </Block>
            <Spacer width={12} />
            <Block block justifyContent="center">
              <Text
                preset="notoSanHeading6Bold"
                colorTheme="white"
                text={element.name}
              />
              <Spacer height={5} />
              <Block block overflow="hidden">
                <Text
                  preset="notoSanBody1Regular"
                  colorTheme="border"
                  text={element.address}
                />
              </Block>
            </Block>
          </Block>
        </Button>
      </React.Fragment>
    ),
    [onPress, theme.colors.primary],
  );

  //render
  if (!item) {
    return null;
  }

  return (
    <Block paddingHorizontal={16}>
      <Text
        text={item.title}
        colorTheme={'white'}
        numberOfLines={1}
        preset="notoSanHeading6Bold"
      />
      {item.wallets?.map(el => renderWalletItem(el))}
    </Block>
  );
};
