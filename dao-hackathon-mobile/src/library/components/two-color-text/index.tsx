import React from 'react';

import { TwoColorTextProps } from './type';

import { Text } from '../text';

export const TwoColorText = ({
  firstText,
  fee,
  lastText,
}: TwoColorTextProps) => {
  return (
    <Text colorTheme={'white'} preset={'notoSanBody2Regular'}>
      {firstText}
      <Text text={fee} colorTheme="fee" preset="notoSanBold14" />
      <Text
        text={lastText}
        colorTheme={'white'}
        preset={'notoSanBody2Regular'}
      />
    </Text>
  );
};
