import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { ChooseOrientationScreen } from '@src/screens/main/stack/nft/customize/choose-orientation';
import { DesignCardScreen } from '@src/screens/main/stack/nft/customize/design-card';

import { CUSTOMIZE_STACK } from '../screen-types';

const CustomizeStack = createStackNavigator();

export const CustomizeStackScreen = () => {
  // render
  return (
    <CustomizeStack.Navigator
      initialRouteName={CUSTOMIZE_STACK.CHOOSE_ORIENTATION}
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <CustomizeStack.Screen
        name={CUSTOMIZE_STACK.CHOOSE_ORIENTATION}
        component={ChooseOrientationScreen}
      />
      <CustomizeStack.Screen
        name={CUSTOMIZE_STACK.DESIGN_CARD}
        component={DesignCardScreen}
      />
    </CustomizeStack.Navigator>
  );
};
