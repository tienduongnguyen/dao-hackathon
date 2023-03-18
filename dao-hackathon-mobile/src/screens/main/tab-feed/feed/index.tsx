import React from 'react';

import { ScreenComponent } from '@src/components';
import { Block } from '@src/library/components';

import { RightHeaderComponent } from './components/RightHeaderComponent';

export const Feed = () => {
  // render
  return (
    <ScreenComponent
      titleHeader={'Newsfeed'}
      rightComponent={<RightHeaderComponent />}
      children={<Block block paddingHorizontal={16} />}
    />
  );
};
