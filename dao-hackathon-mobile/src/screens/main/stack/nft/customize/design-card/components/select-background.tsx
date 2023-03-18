import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { BOTTOM_SHEET_HEIGHT } from '@src/common';
import {
  Block,
  Button,
  Collapsible,
  Divider,
  Icon,
  Modal,
  Spacer,
  Text,
} from '@src/library/components';

import { OptionData, SelectBackgroundProps } from '../type';

export const SelectBackground = forwardRef(
  (
    { optionsImage, onPressColor, onPressImage }: SelectBackgroundProps,
    ref,
  ) => {
    //state
    const [isVisible, setIsVisible] = useState(false);
    const [isCollapsedGallery, setIsCollapsedGallery] = useState<boolean>(true);

    //func
    const onHide = () => {
      setIsVisible(false);
    };

    const onToggleGallery = () => {
      setIsCollapsedGallery(v => !v);
    };

    const renderItem = (item: OptionData, index: number) => {
      return (
        <React.Fragment key={index}>
          <Block>
            <Button
              onPress={() => {
                onHide();
                item.itemCallback();
                onToggleGallery();
              }}
            >
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

            {index !== optionsImage.length - 1 && (
              <Divider colorTheme="primary6" />
            )}
          </Block>
        </React.Fragment>
      );
    };

    const renderContentGallery = () => {
      return (
        <Block borderRadius={5} overflow={'hidden'} marginHorizontal={16}>
          {optionsImage.map((item: OptionData, index: number) => {
            return renderItem(item, index);
          })}
        </Block>
      );
    };

    const renderMasterView = () => {
      return (
        <Block
          paddingHorizontal={16}
          direction="row"
          paddingVertical={18}
          justifyContent={'space-between'}
        >
          <Block direction="row">
            <Icon icon="gallery" />
            <Spacer width={20} />
            <Text
              text="Upload background image"
              colorTheme={'white'}
              preset={'notoSanBody1Regular'}
            />
          </Block>
          <Icon
            icon={isCollapsedGallery ? 'arrow_down' : 'arrow_up'}
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

    //render
    return (
      <Modal
        animatedIn="slideInUp"
        animatedOut="slideOutDown"
        backdropColor="transparent"
        isVisible={isVisible}
        onBackdropPress={onHide}
        onBackButtonPress={onHide}
        style={{ justifyContent: 'flex-end' }}
      >
        <Block
          height={BOTTOM_SHEET_HEIGHT}
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          colorTheme="background_popup"
        >
          <Button onPress={onPressColor}>
            <Block
              width={'100%'}
              height={60}
              middle
              paddingHorizontal={16}
              direction="row"
            >
              <Icon icon="color_palette" size={24} colorTheme="white" />
              <Spacer width={16} />
              <Text
                text="Choose background color"
                preset="notoSanBody1Regular"
                colorTheme="text1"
              />
            </Block>
          </Button>
          <Divider colorTheme="primary6" />
          <Button
            onPress={() => {
              onHide();
              onPressImage && onPressImage();
            }}
          >
            <Collapsible
              withAnimated={true}
              renderMasterView={() => renderMasterView()}
              renderContent={renderContentGallery}
              onToggle={onToggleGallery}
            />
          </Button>
        </Block>
      </Modal>
    );
  },
);

export type SelectBackground = {
  show: () => void;
  hide: () => void;
};
