import React, { memo } from 'react';

import isEqual from 'react-fast-compare';

import { Block } from '@src/library/components';
import { useTheme } from '@src/themes';

import { PolkadotProps } from './type';
import WView from './WView';

export default memo((props: PolkadotProps) => {
  //func
  const { current, total = 3 } = props;
  const list = Array.from(Array(total).keys());
  const { colors } = useTheme();

  //render
  return (
    <Block alignSelf="center" direction="row">
      {list.map((_, index) => (
        <WView
          width={10}
          key={index}
          marginHorizontal={2}
          aspectRatio={1}
          borderRadius={5}
          borderWidth={1}
          borderColor={colors.primary}
          backgroundColor={current === index ? colors.primary : colors.primary3}
        />
      ))}
    </Block>
  );
}, isEqual);
