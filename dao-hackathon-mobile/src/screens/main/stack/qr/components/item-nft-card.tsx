/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Image, useWindowDimensions } from 'react-native';

import { execFunc, sizeScale } from '@src/common';
import { WText } from '@src/components';
import {
  Block,
  Button,
  CheckBox,
  ImageRemote,
  Spacer,
} from '@src/library/components';

import { ItemNFTCardProps } from '../type';

export const ItemNFTCard = ({
  item,
  selected = false,
  disable = false,
  onPressItem,
}: ItemNFTCardProps) => {
  //state
  // const { width } = Dimensions.get('window');
  const { width: widthScreen } = useWindowDimensions();
  const actualWidth = (widthScreen - sizeScale(48)) / 2;

  const [height, setHeight] = useState<number>(actualWidth / 1.75);

  //func
  const selectItem = useCallback(() => {
    execFunc(onPressItem, item);
  }, [item, onPressItem]);
  const onGetImageSize = () => {
    Image.getSize(item?.metadata?.image?.toString(), (_width, _height) => {
      if (_width) {
        setHeight(actualWidth * (_height / _width));
      }
    });
  };

  //effect
  useEffect(() => {
    onGetImageSize();
  }, []);

  //render
  return (
    <Block>
      <Button onPress={selectItem}>
        <Block height={height} overflow="hidden" borderRadius={5}>
          <ImageRemote source={item?.metadata.image.toString()} />
          <Block
            middle
            left={8}
            bottom={8}
            height={24}
            borderRadius={5}
            paddingHorizontal={6}
            position="absolute"
            justifyContent="center"
            colorTheme="background_name"
          >
            <WText
              font="regular12"
              ellipsizeMode="tail"
              numberOfLines={1}
              color="white"
              children={item?.data.name}
            />
          </Block>
          <Block position="absolute" top={0} right={0}>
            <CheckBox
              onToggle={selectItem}
              type="circle"
              size={20}
              disable={disable}
              value={selected}
            />
          </Block>
        </Block>
      </Button>
      <Spacer height={16} />
    </Block>
  );
};
