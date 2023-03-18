import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { BOTTOM_SHEET_HEIGHT } from '@src/common';
import { useTheme } from '@src/themes';

import { nftBottomProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { Modal } from '../modal';
import { Spacer } from '../spacer';
import { Text } from '../text';

export const NftBottom = forwardRef(
  ({ onClose, onPressCancel, onPressSubmit }: nftBottomProps, ref) => {
    // state
    const [isPhotoShown, setIsPhotoShown] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { colors } = useTheme();
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [allowLabel, setAllowLabel] = useState('');
    const [cancelLabel, setCancelLabel] = useState('');
    const [isJustShowAllowButton, setIsJustShowAllowButton] = useState(false);

    //func
    const onHide = () => {
      setIsVisible(false);
    };
    // effect
    useImperativeHandle(
      ref,
      () => ({
        show: (
          isPhoto: boolean,
          messageData: string,
          titleData?: string,
          isJustShowAllowButtonData?: boolean,
          allowLabelData?: string,
          cancelLabelData?: string,
        ) => {
          setIsVisible(true);
          setIsPhotoShown(isPhoto);
          !!messageData && setMessage(messageData);
          !!titleData && setTitle(titleData);
          !!cancelLabelData && setCancelLabel(cancelLabelData);
          !!allowLabelData && setAllowLabel(allowLabelData);
          typeof isJustShowAllowButtonData === 'boolean' &&
            setIsJustShowAllowButton(isJustShowAllowButtonData);
        },
        hide: () => {
          setIsVisible(false);
          setIsPhotoShown(false);
          setMessage('');
          setTitle('');
          setAllowLabel('');
          setCancelLabel('');
          setIsJustShowAllowButton(false);
        },
      }),
      [],
    );
    //render
    return (
      <Modal
        animatedIn="slideInUp"
        animatedOut="slideOutDown"
        backdropColor="transparent"
        onBackdropPress={onHide}
        onBackButtonPress={onHide}
        isVisible={isVisible}
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
              text={title ? title : 'Request access'}
              preset={'notoSanBody1Regular'}
              colorTheme={'white'}
            />
            <Icon onPress={onClose} icon={'close'} colorTheme={'white'} />
          </Block>
          <Divider colorTheme="primary6" />
          <Block marginTop={16} paddingHorizontal={20}>
            <Text preset={'notoSanBody2Regular'} colorTheme="white">
              {message
                ? message
                : isPhotoShown
                ? 'Mesme needs permission to your access camera roll. This allow you to upload photo to this application.'
                : 'Mesme needs permission to use your camera. This allow you to take a photo or scan name cards.'}
            </Text>
          </Block>
          <Block block justifyContent="flex-end" paddingBottom={50}>
            <Block direction="row" paddingHorizontal={16}>
              {!isJustShowAllowButton && (
                <React.Fragment>
                  <Block block>
                    <Button
                      onPress={onPressCancel}
                      text={cancelLabel ? cancelLabel : 'No'}
                      preset={'outline'}
                      typePreset={'medium'}
                      textColorTheme={'white'}
                      borderColorTheme={'white'}
                      buttonColorTheme={'transparent'}
                    />
                  </Block>
                  <Spacer width={9} />
                </React.Fragment>
              )}
              <Block block>
                <Button
                  onPress={onPressSubmit}
                  text={allowLabel ? allowLabel : 'Allow'}
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
  },
);

export type NftBottom = {
  show: (
    isPhoto: boolean,
    message?: string,
    title?: string,
    isJustShowAllowButtonData?: boolean,
    allowLabelData?: string,
    cancelLabel?: string,
  ) => void;
  hide: () => void;
};
