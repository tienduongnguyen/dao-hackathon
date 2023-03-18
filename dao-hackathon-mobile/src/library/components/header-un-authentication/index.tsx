import React from 'react';

import { Block, Spacer, Text } from '@components';
import { goBack } from '@src/navigation/navigation-service';

import { HeaderUnAuthenticationProps } from './type';

import { Icon } from '../icon';

export const HeaderUnAuthentication = ({
  headerTitle,
  subTitle,
}: HeaderUnAuthenticationProps) => {
  return (
    <Block direction="row" width={'100%'} marginTop={20} paddingHorizontal={12}>
      <Block>
        <Icon icon="back" size={30} onPress={goBack} />
      </Block>
      <Spacer width={8} />
      <Block block>
        <Text
          text={headerTitle}
          preset="notoSanHeading2Bold"
          colorTheme="white"
        />
        {subTitle && (
          <>
            <Spacer height={12} />
            <Text
              text={subTitle}
              preset="notoSanBody4Regular"
              colorTheme="white"
            />
          </>
        )}
      </Block>
    </Block>
  );
};
