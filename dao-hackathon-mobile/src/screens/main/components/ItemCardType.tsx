import React from 'react';
import { TouchableOpacity } from 'react-native';

import R from '@src/assets/R';
import { FastImg, WText } from '@src/components';
import WView from '@src/components/WView';

import { useMainStyle } from '../style';

const ItemCardType = ({
  item,
  onPress,
  idSelect,
}: {
  item: any;
  index: number;
  idSelect?: string | number;
  onPress?: (data: any) => void;
}) => {
  const { styles, colors } = useMainStyle();
  const onPressNFT = () => {
    if (onPress) {
      return onPress(item.mint);
    }
  };
  const isSelect = idSelect === item.mint;
  return (
    <TouchableOpacity onPress={onPressNFT} style={styles.itemCardButton}>
      <FastImg
        source={{ uri: item.metadata.image }}
        resizeMode="contain"
        style={[
          {
            opacity: isSelect ? 1 : 0.5,
          },
          styles.itemCardImage,
        ]}
      />
      {!!isSelect && (
        <WView style={styles.itemCardBox}>
          <FastImg
            source={R.images.ic_check}
            style={{
              width: 15,
              aspectRatio: 1,
            }}
            tintColor={colors.white}
          />
        </WView>
      )}
      <WText
        font="regular12"
        style={styles.itemCardText}
        ellipsizeMode="tail"
        numberOfLines={1}
        color="white"
        children={item.data.name}
      />
    </TouchableOpacity>
  );
};

export default ItemCardType;
