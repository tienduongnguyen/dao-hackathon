import React, { useMemo } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

import { WText } from '@src/components';
import WView from '@src/components/WView';

import { useMainStyle } from '../style';
import { ButtonWalletProps } from '../type';

const SelectButtonWallet = ({
  onPress,
  title,
  isSelect,
}: ButtonWalletProps) => {
  const { styles, colors } = useMainStyle();
  const onPressSelect = () => {
    if (onPress) {
      onPress(title);
    }
  };

  const reStyle = useMemo<ViewStyle>(() => {
    return {
      borderBottomWidth: isSelect ? 3 : 1,
      borderBottomColor: isSelect ? colors.primary : colors.primary6,
    };
  }, [colors.primary, colors.primary6, isSelect]);

  return (
    <>
      <TouchableOpacity
        onPress={onPressSelect}
        style={[styles.buttonWalletButton, reStyle]}
      >
        <WText
          font="bold14"
          style={{
            color: isSelect ? colors.white : colors.primary7,
          }}
          color="white"
          children={title}
        />
        <WView style={styles.buttonWalletBox} />
      </TouchableOpacity>
    </>
  );
};

export default SelectButtonWallet;
