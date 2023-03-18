import React from 'react';

import { BOTTOM_SHEET_HEIGHT } from '@src/common';
import { useTheme } from '@src/themes';

import { BottomSheetProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { Modal } from '../modal';
import { Spacer } from '../spacer';
import { Text } from '../text';

export default function BottomSheet({
  onClose,
  isVisible,
  title,
  disabled,
  description,
  onPressCancel,
  onPressSubmit,
  buttonCancelText,
  buttonSubmitText,
  animatedInDuration = 300,
  animatedOutDuration = 300,
  onBackdropPress,
  showOnUnAuthen = false,
}: BottomSheetProps) {
  //func
  const { colors } = useTheme();
  //render
  return (
    <Modal
      animatedIn="slideInUp"
      animatedOut="slideOutDown"
      backdropColor="transparent"
      isVisible={isVisible}
      showOnUnAuthen={showOnUnAuthen}
      animatedInDuration={animatedInDuration}
      animatedOutDuration={animatedOutDuration}
      onBackdropPress={onBackdropPress}
      style={{ justifyContent: 'flex-end' }}
      hasGesture={false}
    >
      <Block
        width={'100%'}
        height={BOTTOM_SHEET_HEIGHT}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        colorTheme={'background_popup'}
      >
        <Block
          paddingVertical={18}
          direction={'row'}
          justifyContent={'space-between'}
          middle
          paddingHorizontal={16}
        >
          <Text
            text={title}
            preset={'notoSanHeading6Bold'}
            colorTheme={'white'}
          />
          <Icon onPress={onClose} icon={'close'} colorTheme={'white'} />
        </Block>
        <Divider colorTheme="primary6" />
        <Block marginTop={16} paddingHorizontal={20}>
          <Text preset={'notoSanBody2Regular'} colorTheme="white">
            {description}
          </Text>
        </Block>
        <Block block justifyContent="flex-end" paddingBottom={50}>
          <Block direction="row" paddingHorizontal={16}>
            <Block block>
              <Button
                disabled={disabled}
                onPress={onPressCancel}
                text={buttonCancelText}
                preset={'outline'}
                typePreset={'medium'}
                textColorTheme={'white'}
                borderColorTheme={'white'}
                buttonColorTheme={'transparent'}
              />
            </Block>
            <Spacer width={9} />
            <Block block>
              <Button
                disabled={disabled}
                onPress={onPressSubmit}
                text={buttonSubmitText}
                gradient={colors.gradient}
                preset={'outline'}
                typePreset={'medium'}
                textColorTheme={'white'}
              />
            </Block>
          </Block>
        </Block>
      </Block>
    </Modal>
  );
}
