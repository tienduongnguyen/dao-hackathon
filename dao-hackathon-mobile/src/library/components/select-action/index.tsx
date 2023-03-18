import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { BOTTOM_SHEET_HEIGHT } from '@src/common';

import { OptionData, SelectActionProps } from './type';

import { Block } from '../block';
import { Button } from '../button';
import { Divider } from '../divider';
import { Icon } from '../icon';
import { Modal } from '../modal';
import { Text } from '../text';

export const SelectAction = forwardRef(({ option }: SelectActionProps, ref) => {
  // state
  const [isVisible, setIsVisible] = useState(false);

  //function
  const onHide = () => {
    setIsVisible(false);
  };

  const renderItem = (item: OptionData, index: number) => {
    return (
      <React.Fragment key={index.toString()}>
        <Block>
          <Button
            onPress={() => {
              onHide();
              item.itemCallback();
            }}
          >
            <Block
              paddingHorizontal={16}
              direction="row"
              paddingVertical={18}
              justifyContent={'space-between'}
            >
              <Text
                text={item.text}
                colorTheme={'white'}
                preset={'notoSanBody1Regular'}
              />
              <Icon icon={item.icon} />
            </Block>
          </Button>
          {index !== option.length - 1 && <Divider colorTheme="primary6" />}
        </Block>
      </React.Fragment>
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
      hasGesture={false}
    >
      <Block
        width={'100%'}
        height={BOTTOM_SHEET_HEIGHT}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        colorTheme={'background_popup'}
      >
        {option.map(renderItem)}
      </Block>
    </Modal>
  );
});

export type SelectAction = {
  show: () => void;
  hide: () => void;
};
