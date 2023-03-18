import React from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { onCheckType, sizeScale } from '@src/common';
import { WPolkadot } from '@src/components';
import { useTheme } from '@src/themes';

import { FooterWithIndicatorProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Spacer } from '../spacer';

export const FooterWithIndicator = ({
  current,
  total = 3,
  onPress,
  btnLabel,
  isValid = false,
  twoButton = false,
  secondBtnLabel,
  onPressSecondButton,
}: FooterWithIndicatorProps) => {
  // state
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // function
  const onPressButton = () => {
    if (onCheckType(onPress, 'function')) {
      onPress();
    }
  };

  const secondButtonPressed = () => {
    if (onCheckType(onPressSecondButton, 'function')) {
      onPressSecondButton();
    }
  };

  // render
  return (
    <Block
      position="absolute"
      bottom={insets.bottom + sizeScale(16)}
      width={'100%'}
      paddingHorizontal={16}
      justifyContent="flex-end"
    >
      <WPolkadot current={current} total={total} />
      <Spacer height={40} />
      <Button
        onPress={onPressButton}
        text={btnLabel}
        textColorTheme="white"
        gradient={colors.gradient}
        preset="primary"
        typePreset="medium"
        disabled={!isValid}
      />
      {twoButton && (
        <>
          <Spacer height={24} />
          <Button
            onPress={secondButtonPressed}
            text={secondBtnLabel}
            textColorTheme="white"
            buttonColorTheme="transparent"
            preset="outline"
            borderColorTheme="white"
            typePreset="medium"
          />
        </>
      )}
    </Block>
  );
};
