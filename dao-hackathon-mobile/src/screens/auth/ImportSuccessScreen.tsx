import React from 'react';

import {
  Block,
  FooterWithIndicator,
  Screen,
  Text,
} from '@src/library/components';
import { APP_SCREEN } from '@src/navigation/screen-types';
import { actions } from '@src/redux';
import { ACTION } from '@src/redux/actions';

const ImportSuccessScreen = () => {
  //func
  const onPressStart = async () => {
    await actions(ACTION.SET_APP_EXPIRED)({ appExpired: false });
    actions(ACTION.SCREEN_NAVIGATION)({
      route: APP_SCREEN.AUTHORIZE,
    });
  };

  //render
  return (
    <Screen statusBarStyle="light-content">
      <Block marginTop={20} paddingHorizontal={16}>
        <Text
          preset="notoSanHeading2Bold"
          colorTheme="white"
          text={'Your account has been successfully imported!'}
        />
      </Block>
      <FooterWithIndicator
        current={2}
        btnLabel={'Finish'}
        onPress={onPressStart}
        isValid={true}
      />
    </Screen>
  );
};

export default ImportSuccessScreen;
