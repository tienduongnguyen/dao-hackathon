import React from 'react';

import { Block, Skeleton } from '@components';

export const LoadingSkeleton = () => {
  return (
    <Skeleton>
      <Block block paddingHorizontal={16}>
        <Block color="red" height={104} marginTop={12} width={'100%'} />
        <Block color="red" height={68} marginTop={12} marginLeft={12} />
        <Block color="red" height={133} marginTop={32} width={'100%'} />
        <Block
          color="red"
          height={40}
          marginTop={200}
          width={'100%'}
          borderRadius={100}
        />
      </Block>
    </Skeleton>
  );
};
