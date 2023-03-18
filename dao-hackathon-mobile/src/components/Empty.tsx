import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { Block, Img, Spacer } from '@src/library/components';

import { useComponentsStyle } from './styles';
import { EmptyProps } from './type';
import WText from './WText';

const Empty = ({ description, onRefresh, marginTop }: EmptyProps) => {
  //func
  const { styles, colors } = useComponentsStyle();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={false} />
      }
      style={styles.emptyContainer}
      children={
        <View style={[styles.boxEmpty, { marginTop: marginTop || '40%' }]}>
          <Block width={207} height={198} overflow="hidden">
            <Img source="empty" />
          </Block>
          <Spacer height={16} />
          <WText
            color={colors.primary7}
            style={styles.boxText}
            children={
              description ||
              'Oops! There is nothing here.\nPlease Scan or Manual any Name card'
            }
          />
        </View>
      }
    />
  );
};

export default Empty;
