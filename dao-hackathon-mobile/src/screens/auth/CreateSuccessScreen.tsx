import React from 'react';

import {
  Block,
  FooterWithIndicator,
  Screen,
  Text,
} from '@src/library/components';
import { APP_SCREEN } from '@src/navigation/screen-types';
import { ACTION, actions } from '@src/redux';

const CreateSuccessScreen = () => {
  const onPressStart = async () => {
    await actions(ACTION.SET_APP_EXPIRED)({ appExpired: false });
    actions(ACTION.SCREEN_NAVIGATION)({
      route: APP_SCREEN.AUTHORIZE,
    });
  };
  const a: [string] = ['a'];
  console.log(a);

  return (
    <Screen statusBarStyle="light-content">
      <Block marginTop={20} paddingHorizontal={16}>
        <Text
          preset="notoSanHeading2Bold"
          colorTheme="white"
          text={'Your account has been successfully created!'}
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

export default CreateSuccessScreen;
