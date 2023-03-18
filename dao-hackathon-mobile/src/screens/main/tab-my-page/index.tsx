import React from 'react';

import { ScreenComponent } from '@src/components';
import { Block, Icon, Spacer } from '@src/library/components';
import { useReducer } from '@src/redux';

import { CreateMyPage } from './create-my-page';

export const MyPageScreen = () => {
  //state
  const { profile } = useReducer(x => x.Profile);
  //func
  const renderRightComponent = (
    <Block direction="row">
      <Icon icon="ic_search_feed" />
      <Spacer width={8} />
      <Icon icon="setting" />
      <Spacer width={8} />
      <Icon icon="ic_share" />
    </Block>
  );
  // render
  return (
    <ScreenComponent
      rightComponent={renderRightComponent}
      titleHeader={'My page'}
      children={<Block block>{!profile ? <CreateMyPage /> : null}</Block>}
    />
  );
};
