import React, { useCallback } from 'react';

import { rearrangeData } from '@src/common';
import { Block, CaptureImage, Screen } from '@src/library/components';
import { goBack, navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';

export const TakePhotoOneSideScreen = () => {
  // function
  const onClose = () => {
    goBack();
  };

  const onNext = useCallback((uri: Array<string>) => {
    navigate(AUTHORIZE_STACK.LISTING_CARD_ONE_SIDE, {
      data: rearrangeData(uri),
      // onFilterImage: onFilterImage,
    });
  }, []);

  //render
  return (
    <Screen statusColor={'transparent'}>
      <Block block colorTheme="background">
        <CaptureImage onClose={onClose} onNext={onNext} />
      </Block>
    </Screen>
  );
};
