import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { styles } from './styles';
import { InfoPopupProps } from './type';

import { Block } from '../block';
import { Modal } from '../modal';
import { Text } from '../text';
const INFO_POPUP_HEIGHT = 70;
export const InfoPopup = forwardRef(
  (
    {
      text,
      backgroundColor,
      animatedInDuration = 300,
      animatedOutDuration = 300,
      onBackdropPress,
      popupShownDuration = 3000,
    }: InfoPopupProps,
    ref,
  ) => {
    //state
    const [isVisible, setIsVisible] = useState(false);
    //effect
    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setIsVisible(true);
          setTimeout(() => {
            setIsVisible(false);
          }, popupShownDuration);
        },
        hide: () => {
          setIsVisible(false);
        },
      }),
      [popupShownDuration],
    );

    return (
      <Modal
        isVisible={isVisible}
        animatedIn="fadeIn"
        animatedOut="fadeOut"
        backdropColor="transparent"
        animatedInDuration={animatedInDuration}
        animatedOutDuration={animatedOutDuration}
        onBackdropPress={onBackdropPress}
        style={styles.popupBackground}
        hasGesture={false}
      >
        <Block
          width={'100%'}
          height={INFO_POPUP_HEIGHT}
          borderRadius={8}
          colorTheme={backgroundColor}
          paddingHorizontal={40}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Text
            text={text}
            preset={'notoSanBody2Regular'}
            colorTheme={'white'}
            textAlign="center"
          />
        </Block>
      </Modal>
    );
  },
);

export interface InfoPopup {
  show(): void;
  hide(): void;
}
