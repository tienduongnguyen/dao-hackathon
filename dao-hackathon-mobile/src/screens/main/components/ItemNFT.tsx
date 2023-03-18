import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';

import { WText } from '@src/components';
import { Block, ImageRemote, Spacer } from '@src/library/components';
import { NftType } from '@src/model';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { useReducer } from '@src/redux';

import { useMainStyle } from '../style';

const ItemNFT = ({
  item,
  addressReceived,
  isFromNotification = false,
  onPress,
}: {
  item: NftType;
  addressReceived?: string;
  isFromNotification?: boolean;
  onPress?: (data: any) => void;
}) => {
  //state
  const { styles } = useMainStyle();
  const { data } = useReducer(x => x.Wallet);

  //func
  const onPressNFT = () => {
    if (onPress) {
      return onPress(item);
    }
    if (isFromNotification) {
      const isHasAddress = data.includes(addressReceived || '');
      if (!isHasAddress) {
        Alert.alert('Transfer', 'You deleted this wallet!');
        return;
      }
      navigate(AUTHORIZE_STACK.NFT_DETAIL, {
        item: { ...item, addressReceived },
      });
    } else {
      navigate(AUTHORIZE_STACK.NFT_DETAIL, {
        item,
      });
    }
  };

  //render
  return (
    <TouchableOpacity onPress={onPressNFT} style={[styles.itemNFTButton]}>
      <Spacer height={16} />
      <ImageRemote
        source={item?.metadata?.image?.toString() ?? ''}
        resizeMode="cover"
        containerStyle={[
          {
            height: item?.height,
          },
          styles.itemNFTImage,
        ]}
      />
      <Block
        block
        middle
        left={8}
        bottom={8}
        height={24}
        borderRadius={5}
        marginRight={16}
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
          children={item?.data?.name}
        />
      </Block>
    </TouchableOpacity>
  );
};

export default ItemNFT;
