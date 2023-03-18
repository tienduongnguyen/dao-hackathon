import React from 'react';
import { TouchableOpacity } from 'react-native';

import { NetworkType } from '@src/common';
import { WText } from '@src/components';
import WView from '@src/components/WView';
import { Block, Img, Spacer, Text } from '@src/library/components';

import { useMainStyle } from '../style';

const ItemSelectAddress = ({
  item,
  index,
  onPress,
  names,
  network,
}: {
  item: any;
  names: string[];
  index: number;
  onPress?: (address: any, name: string, networkType: NetworkType) => void;
  network: NetworkType;
}) => {
  const { styles, colors } = useMainStyle();
  const onPressAddress = () => {
    if (onPress) {
      onPress(item, names[index], network);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={onPressAddress}
        style={styles.itemSelectButton}
      >
        <WText
          style={styles.itemSelectText}
          color={colors.primary4}
          children={`${names[index]}`}
        />
        <Block width={'100%'} direction={'row'} middle>
          <Block width={24} height={24}>
            <Img source={network as NetworkType} />
          </Block>
          <Spacer width={9} />
          <Block block>
            <Text
              text={`(${item})`}
              preset={'notoSanBody2Regular'}
              colorTheme={'primary7'}
            />
          </Block>
        </Block>
      </TouchableOpacity>
      <WView style={styles.itemSelectBox} />
    </>
  );
};

export default ItemSelectAddress;
