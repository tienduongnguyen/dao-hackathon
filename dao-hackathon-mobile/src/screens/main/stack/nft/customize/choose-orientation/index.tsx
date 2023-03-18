import React, { useState } from 'react';

import {
  Block,
  Button,
  CheckBox,
  HeaderAuthentication,
  Screen,
  Spacer,
  Text,
} from '@src/library/components';
import { goBack, navigate } from '@src/navigation/navigation-service';
import { CUSTOMIZE_STACK } from '@src/navigation/screen-types';

export const ChooseOrientationScreen = () => {
  //state
  const [selected, setSelected] = useState<'1-sided' | '2-sided'>('1-sided');
  //func
  const onPressLandScape = () => {
    navigate(CUSTOMIZE_STACK.DESIGN_CARD, { type: selected });
  };

  const onPressPortrait = () => null;

  const selectItem = (value: '1-sided' | '2-sided') => {
    setSelected(value);
  };

  const renderCheckBox = () => {
    return (
      <Block direction="row">
        <Spacer width={16} />
        <CheckBox
          onToggle={() => selectItem('1-sided')}
          type="circle"
          size={20}
          value={selected === '1-sided'}
          text={'1-sided'}
        />
        <Spacer width={24} />
        <CheckBox
          onToggle={() => selectItem('2-sided')}
          type="circle"
          size={20}
          text={'2-sided'}
          value={selected === '2-sided'}
        />
      </Block>
    );
  };
  //render
  return (
    <Screen statusBarStyle="light-content" scroll>
      <HeaderAuthentication txTitle="Customize" onPress={goBack} />
      <Spacer height={32} />
      {renderCheckBox()}
      <Block padding={16}>
        <Text
          text="Choose name card orientation"
          preset="notoSanBody1Regular"
          colorTheme="text1"
        />
      </Block>

      <Block block paddingHorizontal={16} middle>
        <Button onPress={onPressLandScape}>
          <Block
            width={343}
            height={193}
            borderWidth={1}
            borderRadius={5}
            middle
            justifyContent="center"
            borderColorTheme="primary6"
          >
            <Block
              width={312}
              height={160}
              borderWidth={1}
              borderColorTheme="white"
              borderRadius={5}
              position="absolute"
              borderStyle="dashed"
            />
            <Text
              text="Landscape"
              preset="notoSanBody1Regular"
              colorTheme="text1"
            />
          </Block>
        </Button>
        <Spacer height={16} />
        <Button disabled onPress={onPressPortrait}>
          <Block
            width={193}
            height={343}
            borderWidth={1}
            borderRadius={5}
            middle
            justifyContent="center"
            borderColorTheme="primary6"
          >
            <Block
              width={160}
              height={312}
              borderWidth={1}
              borderColorTheme="white"
              borderRadius={5}
              position="absolute"
              borderStyle="dashed"
            />
            <Text
              text="Portrait"
              preset="notoSanBody1Regular"
              colorTheme="text1"
            />
          </Block>
        </Button>
      </Block>
    </Screen>
  );
};
