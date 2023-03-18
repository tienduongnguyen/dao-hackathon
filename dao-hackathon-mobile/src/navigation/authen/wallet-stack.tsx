import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import WalletScreen from '@src/screens/main/WalletScreen';

import { WALLET_STACK } from '../screen-types';

const WalletStack = createStackNavigator();

export const WalletStackScreen = () => {
  // render
  return (
    <WalletStack.Navigator screenOptions={{ headerShown: false }}>
      <WalletStack.Screen name={WALLET_STACK.WALLET} component={WalletScreen} />
    </WalletStack.Navigator>
  );
};
