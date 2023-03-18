import React from 'react';

import { Block, Button, Icon, Spacer, Text } from '@src/library/components';

import { ToolsProps } from '../type';

export const Tools = ({
  onPressBackground,
  onPressAddPhoto,
  onPressEmoji,
  onPressText,
}: ToolsProps) => {
  return (
    <Block
      height={64}
      paddingHorizontal={11}
      direction="row"
      middle
      justifyContent="space-between"
    >
      <Button onPress={onPressBackground}>
        <Block justifyContent="center" middle width={72}>
          <Icon icon="background" size={24} colorTheme="white" />
          <Spacer height={8} />
          <Text
            text="Background"
            preset="notoSanBody3Regular"
            colorTheme="text1"
          />
        </Block>
      </Button>
      <Button onPress={onPressAddPhoto}>
        <Block justifyContent="center" middle width={72}>
          <Icon icon="add_photo" size={24} colorTheme="white" />
          <Spacer height={8} />
          <Text text="Photo" preset="notoSanBody3Regular" colorTheme="text1" />
        </Block>
      </Button>
      <Button onPress={onPressEmoji}>
        <Block justifyContent="center" middle width={72}>
          <Icon icon="emoji" size={24} colorTheme="white" />
          <Spacer height={8} />
          <Text text="Icon" preset="notoSanBody3Regular" colorTheme="text1" />
        </Block>
      </Button>
      <Button onPress={onPressText}>
        <Block justifyContent="center" middle width={72}>
          <Icon icon="text" size={24} colorTheme="white" />
          <Spacer height={8} />
          <Text text="Text" preset="notoSanBody3Regular" colorTheme="text1" />
        </Block>
      </Button>
    </Block>
  );
};
