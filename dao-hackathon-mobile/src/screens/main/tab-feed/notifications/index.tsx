import React, { useState } from 'react';

import { sizeScale } from '@src/common';
import { ScreenComponent } from '@src/components';
import { Block, Button, Divider, Icon } from '@src/library/components';
import { goBack } from '@src/navigation/navigation-service';

import { ItemCategory } from './components/ItemCategory';
import { ListNotification } from './components/ListNotification';
import { NotificationHeader, ScreenType } from './type';

export const Notification = () => {
  // state
  const [category, setCategory] = useState<Array<NotificationHeader>>([
    {
      id: 1,
      title: 'Social',
      isSelect: true,
      type: ScreenType.SOCIAL,
    },
    {
      id: 2,
      title: 'NFT',
      isSelect: false,
      type: ScreenType.NFT,
    },
  ]);

  // func
  const renderItemCategory = (item: NotificationHeader) => {
    return (
      <React.Fragment key={item.id}>
        <ItemCategory item={item} onPressFilter={handlePressFilter} />
      </React.Fragment>
    );
  };

  const handlePressFilter = (filter: NotificationHeader) => () => {
    setCategory(d =>
      d.map(item => {
        if (item.id === filter.id) {
          return { ...item, isSelect: true };
        }
        return { ...item, isSelect: false };
      }),
    );
  };

  // render
  return (
    <ScreenComponent
      titleHeader={'Notifications'}
      leftComponent={
        <Button onPress={goBack}>
          <Icon icon="ic_left" size={sizeScale(28)} />
        </Button>
      }
      rightComponent={<Block />}
      children={
        <Block block>
          <Block direction="row" paddingHorizontal={16}>
            {category.map(renderItemCategory)}
          </Block>
          <Divider colorTheme="primary6" />
          <ListNotification category={category} />
        </Block>
      }
    />
  );
};
