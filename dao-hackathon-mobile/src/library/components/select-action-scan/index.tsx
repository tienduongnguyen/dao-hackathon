import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { BOTTOM_SHEET_HEIGHT, execFunc } from '@src/common';

import { OptionData, SelectActionScanProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Collapsible } from '../collapsible';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { Modal } from '../modal';
import { Spacer } from '../spacer';
import { Text } from '../text';

export const SelectActionScan = forwardRef(
  (
    {
      showPermission,
      optionsCapture,
      optionsGallery,
      isGrantPhotoPermission,
    }: SelectActionScanProps,
    ref,
  ) => {
    // state
    const [isVisible, setIsVisible] = useState(false);
    const [isCollapsedCapture, setIsCollapsedCapture] = useState<boolean>(true);
    const [isCollapsedGallery, setIsCollapsedGallery] = useState<boolean>(true);

    //function
    const onHide = () => {
      setIsVisible(false);
    };
    const onToggleCapture = () => {
      setIsCollapsedCapture(v => !v);
    };
    const onToggleGallery = () => {
      setIsCollapsedGallery(v => !v);
    };

    const onPressItem = (item: OptionData, type: 'capture' | 'gallery') => {
      return () => {
        if (!isGrantPhotoPermission) {
          execFunc(showPermission);
        } else {
          onHide();
          item.itemCallback();
          if (type === 'capture') {
            onToggleCapture();
          } else {
            onToggleGallery();
          }
        }
      };
    };

    const renderItem = (
      item: OptionData,
      index: number,
      type: 'capture' | 'gallery',
    ) => {
      return (
        <React.Fragment key={index + type}>
          <Block>
            <Button onPress={onPressItem(item, type)}>
              <Block
                paddingHorizontal={16}
                paddingVertical={13}
                colorTheme="background"
              >
                <Text
                  text={item.text}
                  colorTheme={'white'}
                  preset={'notoSanBody1Regular'}
                />
              </Block>
            </Button>

            {index !== optionsCapture.length - 1 && (
              <Divider colorTheme="primary6" />
            )}
          </Block>
        </React.Fragment>
      );
    };
    const renderContentCapture = () => {
      return (
        <Block borderRadius={5} overflow={'hidden'} marginHorizontal={16}>
          {optionsCapture.map((item: OptionData, index: number) => {
            return renderItem(item, index, 'capture');
          })}
        </Block>
      );
    };
    const renderContentGallery = () => {
      return (
        <Block borderRadius={5} overflow={'hidden'} marginHorizontal={16}>
          {optionsGallery.map((item: OptionData, index: number) => {
            return renderItem(item, index, 'gallery');
          })}
        </Block>
      );
    };
    const renderMasterView = (type: 'capture' | 'gallery') => {
      return (
        <Block
          paddingHorizontal={16}
          direction="row"
          paddingVertical={18}
          justifyContent={'space-between'}
        >
          <Block direction="row">
            <Icon icon={type === 'capture' ? 'camera' : 'gallery'} />
            <Spacer width={20} />
            <Text
              text={
                type === 'capture'
                  ? 'Take a photo'
                  : 'Select photo from Camera roll'
              }
              colorTheme={'white'}
              preset={'notoSanBody1Regular'}
            />
          </Block>
          <Icon
            icon={
              (type === 'capture' ? isCollapsedCapture : isCollapsedGallery)
                ? 'arrow_down'
                : 'arrow_up'
            }
            colorTheme="white"
          />
        </Block>
      );
    };

    // effect
    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setIsVisible(true);
        },
        hide: () => {
          setIsVisible(false);
        },
      }),
      [],
    );
    return (
      <Modal
        animatedIn="slideInUp"
        animatedOut="slideOutDown"
        backdropColor="transparent"
        isVisible={isVisible}
        onBackdropPress={onHide}
        onBackButtonPress={onHide}
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
          <Collapsible
            withAnimated={true}
            renderMasterView={() => renderMasterView('gallery')}
            renderContent={renderContentGallery}
            onToggle={onToggleGallery}
          />
          <Divider colorTheme="primary6" />
          <Collapsible
            withAnimated={true}
            renderMasterView={() => renderMasterView('capture')}
            renderContent={renderContentCapture}
            onToggle={onToggleCapture}
          />
        </Block>
      </Modal>
    );
  },
);

export type SelectActionScan = {
  show: () => void;
  hide: () => void;
};
