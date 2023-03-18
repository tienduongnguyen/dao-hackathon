import React, { useCallback, useEffect, useState } from 'react';

import { sizeScale } from '@src/common';
import { Block, Button, Icon, Spacer, Text } from '@src/library/components';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { useReducer } from '@src/redux';

export const RightHeaderComponent = () => {
  // state
  const notification = useReducer(x => x.Notification);
  const [badgeNotification, setBadgeNotification] = useState(0);
  const [badgeChat] = useState(0);

  // func
  const handleToNotification = () => {
    navigate(AUTHORIZE_STACK.NOTIFICATION);
  };

  const handleToChat = () => null;

  const handleSearch = () => null;

  const renderBadge = useCallback((badgeValue: number) => {
    return (
      badgeValue > 0 && (
        <Block
          position="absolute"
          top={0}
          right={badgeValue > 9 ? -17 : -4}
          color={'red'}
          width={badgeValue > 9 ? sizeScale(27) : sizeScale(14)}
          height={sizeScale(14)}
          borderRadius={sizeScale(7)}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            text={badgeValue > 99 ? ' 99+' : badgeValue.toString()}
            colorTheme={'white'}
            fontWeight="700"
            fontSize={11}
          />
        </Block>
      )
    );
  }, []);

  // effect
  useEffect(() => {
    if (notification.data?.length > 0) {
      setBadgeNotification(
        notification.data?.filter(item => !item?.dataNotifications?.statusSeen)
          .length,
      );
    }
  }, [notification]);

  // render
  return (
    <Block direction="row">
      <Button onPress={handleToNotification}>
        <Icon icon="ic_notification" size={sizeScale(28)} />
        {renderBadge(badgeNotification)}
      </Button>
      <Spacer width={20} />
      <Button onPress={handleToChat}>
        <Icon icon="ic_chat" size={sizeScale(28)} />
        {renderBadge(badgeChat)}
      </Button>
      <Spacer width={18} />
      <Button onPress={handleSearch}>
        <Icon icon="ic_search_feed" size={sizeScale(28)} colorTheme="white" />
      </Button>
    </Block>
  );
};
