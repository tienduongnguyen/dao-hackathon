import React, { useMemo } from 'react';

import { ImageTypes } from '@src/assets/image';
import { getTimeDifference } from '@src/common';
import {
  Block,
  Button,
  ImageRemote,
  Img,
  Spacer,
  Text,
} from '@src/library/components';

import { ItemNotificationProps, ScreenType } from '../type';

export const ItemNotification = ({
  item,
  onPressNotification,
}: ItemNotificationProps) => {
  // state
  const address = useMemo(
    () => item.subDescription?.split(''),
    [item.subDescription],
  );

  // func
  const handlePressNotification = () => {
    onPressNotification(item);
  };

  //render
  if (!item) {
    return null;
  }

  return (
    <Button onPress={handlePressNotification}>
      <Block
        direction="row"
        middle
        paddingVertical={16}
        colorTheme={item.isRead ? 'transparent' : 'primary8'}
        paddingHorizontal={16}
      >
        <Block height={60} width={60} overflow="hidden">
          {item.type === ScreenType.NFT ? (
            <Block height={60} width={60} borderRadius={30} overflow="hidden">
              <Img source={item.networkType as ImageTypes} />
            </Block>
          ) : (
            item.image && <ImageRemote source={item.image} />
          )}
        </Block>
        <Spacer width={12} />
        <Block block justifyContent="center">
          <Text
            preset="notoSanHeading6Bold"
            colorTheme="white"
            text={item.title}
          />
          <Spacer height={5} />
          {!!item.subTitle && (
            <Block block overflow="hidden" opacity={0.7}>
              <Text
                numberOfLines={1}
                preset="heading6"
                colorTheme="white"
                ellipsizeMode="tail"
                text={item.subTitle}
              />
            </Block>
          )}
          {!!item.description && (
            <Block block overflow="hidden">
              <Text
                numberOfLines={1}
                preset="body1"
                colorTheme="white"
                ellipsizeMode="tail"
                text={`[${item.description}]`}
              />
            </Block>
          )}
          {!!item.subDescription && (
            <Block block overflow="hidden">
              <Text
                numberOfLines={1}
                preset="body1"
                colorTheme="primary4"
                ellipsizeMode="middle"
                text={`(${address?.slice(0, 4).join('')}...${address
                  ?.slice(address?.length - 4, address?.length)
                  ?.join('')})`}
              />
            </Block>
          )}
        </Block>
        <Block>
          <Text preset="body2" colorTheme="border">
            {getTimeDifference(
              item.createdAt ? new Date(item.createdAt) : new Date(),
            )}
          </Text>
        </Block>
      </Block>
    </Button>
  );
};
