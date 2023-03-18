import React, { ReactNode } from 'react';

import { goBack } from '@src/navigation/navigation-service';

import { Block } from '../block';
import { Button } from '../button';
import { Icon } from '../icon';
import { Spacer } from '../spacer';
import { Text } from '../text';

export const HeaderAuthentication = ({
  txTitle,
  onPress = goBack,
  renderRightComponent,
}: {
  txTitle: string;
  onPress?: () => void;
  renderRightComponent?: () => ReactNode;
}) => {
  return (
    <Block
      marginTop={10}
      width={'100%'}
      height={35}
      direction="row"
      paddingHorizontal={16}
      middle
      justifyContent="space-between"
    >
      <Block direction="row" middle>
        <Button onPress={onPress}>
          <Icon icon="back" size={28} />
        </Button>
        <Spacer width={10} />
        <Text
          text={txTitle}
          preset="notoSanHeading5Bold"
          colorTheme="white"
          textAlign="center"
        />
      </Block>
      {renderRightComponent && renderRightComponent()}
    </Block>
  );
};
