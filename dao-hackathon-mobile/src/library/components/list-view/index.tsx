import React, { forwardRef } from 'react';
import { RefreshControl } from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { ListViewProps } from './type';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const ListView = forwardRef((props: ListViewProps, ref: any) => {
  // state
  const {
    onLoadMore,
    onRefresh,
    canRefresh = true,
    canLoadMore = false,
    refreshing = false,
  } = props;

  // render
  return (
    <AnimatedFlatList
      ref={ref}
      refreshControl={
        canRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      scrollEventThrottle={16}
      onEndReached={canLoadMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.001}
      {...props}
      onRefresh={undefined}
      refreshing={undefined}
    />
  );
});
