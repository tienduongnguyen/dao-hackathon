import React, { useCallback } from 'react';

import { Block, CaptureImage, Screen } from '@src/library/components';
import { goBack, navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';

export const TakePhotoTwoSideScreen = () => {
  // function
  const onClose = () => {
    goBack();
  };

  const onNext = useCallback((data: Array<string>) => {
    navigate(AUTHORIZE_STACK.RENAME_TWO_SIDE, { data });
    console.log(data);
  }, []);

  //render
  return (
    <Screen statusColor={'transparent'}>
      <Block block colorTheme="background">
        <CaptureImage onClose={onClose} onNext={onNext} type="2-sided" />
      </Block>
    </Screen>
  );
};
