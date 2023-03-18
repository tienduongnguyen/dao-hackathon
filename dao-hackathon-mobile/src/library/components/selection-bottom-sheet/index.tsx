import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { VectorIcon } from '@src/assets/vector-icon/vector-icon';
import { BOTTOM_SHEET_HEIGHT } from '@src/common';

import { SelectionItem } from './selection-item';
import { styles } from './styles';
import { Option } from './type';

import { Block } from '../block';
import { Divider } from '../divider';
import { Modal } from '../modal';
import { Text } from '../text';

export const SelectionBottomSheet = forwardRef((_, ref) => {
  // state
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<Array<Option>>([]);

  // function
  const onHide = () => {
    setIsVisible(false);
  };
  const renderItem = (item: Option, index: number) => {
    return (
      <React.Fragment key={index}>
        <SelectionItem key={item.id} item={item} />
        {index === data.length - 1 ? null : <Divider colorTheme={'primary6'} />}
      </React.Fragment>
    );
  };

  // effect
  useImperativeHandle(
    ref,
    () => ({
      show: (dataParam: Array<Option>) => {
        setData(dataParam);
        setIsVisible(true);
      },
      hide: () => {
        setIsVisible(false);
      },
    }),
    [],
  );

  // render
  return (
    <Modal
      animatedIn="slideInUp"
      animatedOut="slideOutDown"
      backdropColor="transparent"
      animatedInDuration={500}
      animatedOutDuration={500}
      isVisible={isVisible}
      onBackdropPress={onHide}
      onBackButtonPress={onHide}
      style={styles.modal}
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
          direction={'row'}
          paddingHorizontal={16}
          paddingVertical={16}
          middle
          justifyContent={'space-between'}
        >
          <Text
            tx={'Select Network'}
            preset={'notoSanHeading6Bold'}
            colorTheme={'white'}
          />
          <VectorIcon
            icon={'x_cross_exit'}
            colorTheme={'white'}
            onPress={onHide}
          />
        </Block>
        <Divider colorTheme={'primary6'} />
        <Block block>{data.map(renderItem)}</Block>
      </Block>
    </Modal>
  );
});

export type SelectionBottomSheet = {
  show: (data: Array<Option>) => void;
  hide: () => void;
};
