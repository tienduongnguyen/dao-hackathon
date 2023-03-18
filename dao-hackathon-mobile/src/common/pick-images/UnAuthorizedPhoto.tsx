import React, { memo } from 'react';

import isEqual from 'react-fast-compare';

import { Block, Button, Icon, Text } from '@components';
import { goBack } from '@src/navigation/navigation-service';

const UnAuthorizedPhotoComponent = () => {
  // render
  return (
    <Block block>
      <Block
        paddingHorizontal={20}
        height={70}
        justifyContent={'center'}
        alignItems={'flex-start'}
      >
        <Button onPress={goBack}>
          <Block padding={5}>
            <Icon icon={'close'} colorTheme={'white'} />
          </Block>
        </Button>
      </Block>
      <Block block middle justifyContent={'center'}>
        <Text
          colorTheme={'text_color_gray'}
          tx={'error:txCameraNotAuthorized'}
        />
      </Block>
    </Block>
  );
};

export const UnAuthorizedPhoto = memo(UnAuthorizedPhotoComponent, isEqual);
