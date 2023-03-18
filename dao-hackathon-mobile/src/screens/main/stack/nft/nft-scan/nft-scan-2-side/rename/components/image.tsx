import React from 'react';
import { Image } from 'react-native';

import { Block, Button, Text } from '@src/library/components';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';

import { styles } from '../styles';
import { ImageTwoSideProps } from '../type';

export const ImageTwoSide = ({ source, side }: ImageTwoSideProps) => {
  //function
  const onPressViewImage = () => {
    navigate(AUTHORIZE_STACK.IMAGE_VIEW, {
      url: source,
    });
  };
  //render
  return (
    <Block>
      <Button onPress={onPressViewImage}>
        <Block overflow="hidden" width={'100%'} height={194}>
          <Image
            style={styles.image}
            source={{ uri: source }}
            resizeMode={'contain'}
          />
        </Block>
      </Button>
      {side ? (
        <Block
          middle
          justifyContent={'center'}
          position="absolute"
          top={8}
          left={8}
          width={46}
          height={20}
          borderRadius={5}
          colorTheme={'primary4'}
        >
          <Text
            text={side}
            preset={'notoSanBody3Regular'}
            colorTheme={'white'}
          />
        </Block>
      ) : null}
    </Block>
  );
};
