import React from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenComponent, WText } from '@components-old';
import WView from '@src/components/WView';
import { Block, Button } from '@src/library/components';
import { navigate } from '@src/navigation/navigation-service';
import { NFT_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';
import LottieView from 'lottie-react-native';

import { useStackStyle } from '../style';

const SuccessScreen = (props: any) => {
  //state
  const addressReducer = useReducer(x => x.Wallet);
  const { colors } = useStackStyle();
  const item = props.route.params;
  const { type = 'transfer' } = item;
  const insets = useSafeAreaInsets();
  const text = type === 'transfer' ? 'Transfer' : 'Mint';

  //func

  const onPressBachHome = async () => {
    const address = addressReducer.data[addressReducer.select];
    navigate(NFT_STACK.NFT);
    actions(ACTION.GET_LIST_NFT)({ address });
  };

  //render
  return (
    <ScreenComponent
      rightComponent={<></>}
      children={
        <>
          <WView marginHorizontal={16} flex={1}>
            <WText
              font="bold40"
              children={`Congratulations on your successful ${text}!`}
            />
          </WView>
          <LottieView
            source={require('../../../../assets/json/success.json')}
            autoPlay
            loop
          />
          <Block bottom={insets.bottom + 20}>
            <Button
              onPress={onPressBachHome}
              text={'Back to home'}
              gradient={colors.gradient}
              typePreset={'medium'}
              preset={'outline'}
              textColorTheme={'white'}
            />
          </Block>
        </>
      }
    />
  );
};

export default SuccessScreen;
